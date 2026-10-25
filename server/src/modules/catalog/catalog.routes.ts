import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";

const router = Router();

const querySchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().optional(), // kateqoriyanın slug-ı
  sort: z.enum(["newest", "price_asc", "price_desc", "name"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

const orderByMap = {
  newest: { createdAt: "desc" },
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  name: { name: "asc" },
} as const;

router.get("/categories", async (_req, res) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  res.json(categories);
});

router.get("/products", async (req, res) => {
  const q = querySchema.parse(req.query);

  const where = {
    category: { isActive: true, ...(q.category ? { slug: q.category } : {}) },
    ...(q.search ? { name: { contains: q.search, mode: "insensitive" as const } } : {}),
  };

  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: orderByMap[q.sort],
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      include: { category: { select: { name: true, slug: true } } },
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

router.get("/products/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { category: { select: { name: true, slug: true } } },
  });
  if (!product) return res.status(404).json({ message: "Məhsul tapılmadı" });
  res.json(product);
});

export default router;