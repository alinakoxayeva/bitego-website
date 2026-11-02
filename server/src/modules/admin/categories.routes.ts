import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";

const router = Router();

const categorySchema = z.object({
  name: z.string().trim().min(2, "Ad ən azı 2 simvol olmalıdır"),
  imageUrl: z.string().trim().url("Şəkil linki düzgün deyil").optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

const AZ_MAP: Record<string, string> = {
  ə: "e", ı: "i", ö: "o", ü: "u", ş: "s", ç: "c", ğ: "g",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[əıöüşçğ]/g, (c) => AZ_MAP[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const isUniqueError = (e: unknown) => (e as { code?: string })?.code === "P2002";

router.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  res.json(categories);
});

router.post("/", async (req, res) => {
  const data = categorySchema.parse(req.body);

  let slug = slugify(data.name) || "kateqoriya";
  if (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        imageUrl: data.imageUrl || null,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
    res.status(201).json(category);
  } catch (e) {
    if (isUniqueError(e)) {
      return res.status(409).json({ message: "Bu adda kateqoriya artıq var" });
    }
    throw e;
  }
});

router.patch("/:id", async (req, res) => {
  const data = categorySchema.partial().parse(req.body);

  const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: "Kateqoriya tapılmadı" });

  try {
    // slug dəyişmir ki, köhnə linklər pozulmasın
    const category = await prisma.category.update({
      where: { id: existing.id },
      data: {
        ...data,
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl || null } : {}),
      },
    });
    res.json(category);
  } catch (e) {
    if (isUniqueError(e)) {
      return res.status(409).json({ message: "Bu adda kateqoriya artıq var" });
    }
    throw e;
  }
});

router.delete("/:id", async (req, res) => {
  const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: "Kateqoriya tapılmadı" });

  const productCount = await prisma.product.count({ where: { categoryId: existing.id } });
  if (productCount > 0) {
    return res.status(409).json({
      message: `Bu kateqoriyada ${productCount} məhsul var. Əvvəl onları silin və ya başqa kateqoriyaya keçirin`,
    });
  }

  await prisma.category.delete({ where: { id: existing.id } });
  res.json({ deleted: true });
});

export default router;