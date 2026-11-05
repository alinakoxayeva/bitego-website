import { Router } from "express";
import { z } from "zod";
import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";

const router = Router();

const productSchema = z.object({
  name: z.string().trim().min(2, "Ad ən azı 2 simvol olmalıdır"),
  description: z.string().trim().min(5, "Təsvir ən azı 5 simvol olmalıdır"),
  price: z.coerce.number().positive("Qiymət 0-dan böyük olmalıdır"),
  imageUrl: z.string().trim().url("Şəkil linki düzgün deyil"),
  categoryId: z.string().min(1, "Kateqoriya seçin"),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

const listSchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

router.get("/", async (req, res) => {
  const q = listSchema.parse(req.query);

  // Admin üçün mövcud olmayan (isAvailable=false) məhsullar da görünür
  const where: Prisma.ProductWhereInput = {
    ...(q.search ? { name: { contains: q.search, mode: "insensitive" } } : {}),
    ...(q.category ? { categoryId: q.category } : {}),
  };

  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      include: { category: { select: { id: true, name: true, slug: true } } },
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

router.post("/", async (req, res) => {
  const data = productSchema.parse(req.body);

  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) return res.status(400).json({ message: "Kateqoriya tapılmadı" });

  const product = await prisma.product.create({
    data: {
      ...data,
      price: data.price.toFixed(2),
      isAvailable: data.isAvailable ?? true,
      isFeatured: data.isFeatured ?? false,
    },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });
  res.status(201).json(product);
});

router.patch("/:id", async (req, res) => {
  const data = productSchema.partial().parse(req.body);

  const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: "Məhsul tapılmadı" });

  if (data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) return res.status(400).json({ message: "Kateqoriya tapılmadı" });
  }

  const { price, ...rest } = data;
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: { ...rest, ...(price !== undefined ? { price: price.toFixed(2) } : {}) },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });
  res.json(product);
});

router.delete("/:id", async (req, res) => {
  const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: "Məhsul tapılmadı" });

  // Sifarişdə istifadə olunan məhsul silinmir, yalnız deaktiv edilir (soft delete)
  const usedInOrders = await prisma.orderItem.count({ where: { productId: existing.id } });
  if (usedInOrders > 0) {
    await prisma.product.update({ where: { id: existing.id }, data: { isAvailable: false } });
    return res.json({ deactivated: true });
  }

  await prisma.product.delete({ where: { id: existing.id } });
  res.json({ deleted: true });
});

export default router;