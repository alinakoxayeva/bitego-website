import { Router } from "express";
import { z } from "zod";
import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";

const router = Router();

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "ON_THE_WAY",
  "DELIVERED",
  "CANCELLED",
] as const;
type Status = (typeof STATUSES)[number];

// Admin statusu yalnız irəli apara və ya ləğv edə bilər, geriyə qaytara bilməz
const NEXT_STATUSES: Record<Status, Status[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["ON_THE_WAY", "CANCELLED"],
  ON_THE_WAY: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const listSchema = z.object({
  status: z.enum(STATUSES).optional(),
  search: z.string().trim().optional(),
  from: dateString.optional(),
  to: dateString.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

const statusSchema = z.object({
  status: z.enum(STATUSES),
  cancelReason: z.string().trim().min(3, "Səbəb ən azı 3 simvol olmalıdır").max(300).optional(),
});

const userSelect = { id: true, name: true, email: true, phone: true } as const;

router.get("/", async (req, res) => {
  const q = listSchema.parse(req.query);

  const where: Prisma.OrderWhereInput = {};
  if (q.status) where.status = q.status;
  if (q.from || q.to) {
    where.createdAt = {
      ...(q.from ? { gte: new Date(`${q.from}T00:00:00+04:00`) } : {}),
      ...(q.to ? { lte: new Date(`${q.to}T23:59:59.999+04:00`) } : {}),
    };
  }
  if (q.search) {
    where.OR = /^\d+$/.test(q.search)
      ? [{ orderNumber: Number(q.search) }]
      : [
          { user: { name: { contains: q.search, mode: "insensitive" } } },
          { user: { email: { contains: q.search, mode: "insensitive" } } },
        ];
  }

  const [total, items] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      include: { user: { select: userSelect }, items: true },
    }),
  ]);

  res.json({
    items,
    total,
    page: q.page,
    limit: q.limit,
    totalPages: Math.max(1, Math.ceil(total / q.limit)),
  });
});

router.get("/:id", async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { user: { select: userSelect }, items: true },
  });
  if (!order) return res.status(404).json({ message: "Sifariş tapılmadı" });
  res.json({ ...order, nextStatuses: NEXT_STATUSES[order.status] });
});

router.patch("/:id/status", async (req, res) => {
  const { status, cancelReason } = statusSchema.parse(req.body);

  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) return res.status(404).json({ message: "Sifariş tapılmadı" });

  if (!NEXT_STATUSES[order.status].includes(status)) {
    return res.status(400).json({ message: "Bu statusa keçid mümkün deyil" });
  }
  if (status === "CANCELLED" && !cancelReason) {
    return res.status(400).json({ message: "Ləğv səbəbini yazın" });
  }

  // where-də köhnə statusu da yoxlayırıq: iki admin eyni anda dəyişsə, biri uğursuz olur
  const result = await prisma.order.updateMany({
    where: { id: order.id, status: order.status },
    data: { status, cancelReason: status === "CANCELLED" ? cancelReason : undefined },
  });
  if (result.count === 0) {
    return res
      .status(409)
      .json({ message: "Sifarişin statusu artıq dəyişib, səhifəni yeniləyin" });
  }

  const updated = await prisma.order.findUnique({
    where: { id: order.id },
    include: { user: { select: userSelect }, items: true },
  });
  res.json({ ...updated, nextStatuses: NEXT_STATUSES[status] });
});

export default router;