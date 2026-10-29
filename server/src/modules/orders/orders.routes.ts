import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();
router.use(requireAuth); // bu router-in hamısı giriş tələb edir

const DELIVERY_FEE_CENTS = 200; // 2.00 ₼

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
      }),
    )
    .min(1, "Səbət boşdur"),
  address: z.string().trim().min(5, "Ünvanı yazın"),
  phone: z.string().trim().min(7, "Telefon nömrəsini yazın"),
  note: z.string().trim().max(300).optional(),
  paymentMethod: z.enum(["CASH", "CARD"]),
});

const cancelSchema = z.object({
  reason: z.string().trim().max(300).optional(),
});

router.post("/", async (req, res) => {
  const data = createOrderSchema.parse(req.body);

  // Eyni məhsul iki dəfə gəlibsə, say toplanır
  const quantities = new Map<string, number>();
  for (const item of data.items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  // Qiymət və mövcudluq bazadan götürülür, clientə inanılmır
  const products = await prisma.product.findMany({
    where: {
      id: { in: [...quantities.keys()] },
      isAvailable: true,
      category: { isActive: true },
    },
  });

  if (products.length !== quantities.size) {
    return res
      .status(400)
      .json({ message: "Səbətdəki bəzi məhsullar artıq mövcud deyil. Səbəti yeniləyin." });
  }

  // Pulu qəpiklə (tam ədədlə) hesablayırıq, yuvarlaqlaşdırma xətası olmasın
  let subtotalCents = 0;
  const itemsData = products.map((p) => {
    const priceCents = Math.round(Number(p.price) * 100);
    const quantity = quantities.get(p.id)!;
    subtotalCents += priceCents * quantity;
    return {
      productId: p.id,
      nameSnapshot: p.name,
      priceSnapshot: (priceCents / 100).toFixed(2),
      quantity,
    };
  });

  const totalCents = subtotalCents + DELIVERY_FEE_CENTS;

  const order = await prisma.order.create({
    data: {
      userId: req.user!.id,
      subtotal: (subtotalCents / 100).toFixed(2),
      deliveryFee: (DELIVERY_FEE_CENTS / 100).toFixed(2),
      total: (totalCents / 100).toFixed(2),
      paymentMethod: data.paymentMethod,
      address: data.address,
      phone: data.phone,
      note: data.note,
      items: { create: itemsData },
    },
    include: { items: true },
  });

  res.status(201).json(order);
});

// "/my" mütləq "/:id"-dən əvvəl olmalıdır
router.get("/my", async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  res.json(orders);
});

router.get("/:id", async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: true },
  });
  // Başqasının sifarişi də "tapılmadı" kimi görünür
  if (!order || order.userId !== req.user!.id) {
    return res.status(404).json({ message: "Sifariş tapılmadı" });
  }
  res.json(order);
});

router.patch("/:id/cancel", async (req, res) => {
  const { reason } = cancelSchema.parse(req.body ?? {});

  const result = await prisma.order.updateMany({
    where: { id: req.params.id, userId: req.user!.id, status: "PENDING" },
    data: { status: "CANCELLED", cancelReason: reason },
  });

  if (result.count === 0) {
    return res.status(400).json({ message: "Bu sifarişi ləğv etmək mümkün deyil" });
  }

  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: true },
  });
  res.json(order);
});

export default router;