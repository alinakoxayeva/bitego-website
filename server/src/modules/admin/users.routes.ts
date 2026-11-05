import { Router } from "express";
import { z } from "zod";
import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";

const router = Router();

const listSchema = z.object({
  search: z.string().trim().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

const roleSchema = z.object({ role: z.enum(["USER", "ADMIN"]) });
const blockSchema = z.object({ isBlocked: z.boolean() });

// passwordHash heç vaxt clientə getmir
const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  isBlocked: true,
  createdAt: true,
  _count: { select: { orders: true } },
} as const;

router.get("/", async (req, res) => {
  const q = listSchema.parse(req.query);

  const where: Prisma.UserWhereInput = {
    ...(q.role ? { role: q.role } : {}),
    ...(q.search
      ? {
          OR: [
            { name: { contains: q.search, mode: "insensitive" } },
            { email: { contains: q.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      select: userSelect,
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

router.patch("/:id/role", async (req, res) => {
  const { role } = roleSchema.parse(req.body);

  if (req.params.id === req.user!.id) {
    return res.status(400).json({ message: "Öz rolunuzu dəyişə bilməzsiniz" });
  }
  const existing = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: "İstifadəçi tapılmadı" });

  const user = await prisma.user.update({
    where: { id: existing.id },
    data: { role },
    select: userSelect,
  });
  res.json(user);
});

router.patch("/:id/block", async (req, res) => {
  const { isBlocked } = blockSchema.parse(req.body);

  if (req.params.id === req.user!.id) {
    return res.status(400).json({ message: "Özünüzü blok edə bilməzsiniz" });
  }
  const existing = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: "İstifadəçi tapılmadı" });

  const user = await prisma.user.update({
    where: { id: existing.id },
    data: { isBlocked },
    select: userSelect,
  });
  res.json(user);
});

export default router;