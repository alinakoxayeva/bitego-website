import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const img = (name: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(name)}/600/450`;

const data = [
  { name: "Burgerlər", slug: "burgerler", items: ["Klassik burger", "Çizburger", "Dupleks burger", "Toyuq burger", "Vegan burger"] },
  { name: "Pizzalar", slug: "pizzalar", items: ["Marqarita", "Pepperoni", "Dörd pendir", "Göbələkli pizza", "Mal əti pizza"] },
  { name: "Salatlar", slug: "salatlar", items: ["Sezar salatı", "Yunan salatı", "Çoban salatı", "Toyuqlu salat", "Tuna salatı"] },
  { name: "Şirniyyatlar", slug: "sirniyyatlar", items: ["Çizkeyk", "Tiramisu", "Brauni", "Paxlava", "Dondurma"] },
  { name: "İçkilər", slug: "ickiler", items: ["Limonad", "Ayran", "Soyuq çay", "Kola", "Meyvə şirəsi"] },
  { name: "Əsas yeməklər", slug: "esas-yemekler", items: ["Plov", "Dolma", "Lülə kabab", "Qutab", "Düşbərə"] },
];

async function main() {
  const adminHash = await bcrypt.hash("Admin123!", 10);
  const userHash = await bcrypt.hash("User123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@dadli.az" },
    update: {},
    create: { name: "Admin", email: "admin@dadli.az", passwordHash: adminHash, role: "ADMIN" },
  });
  await prisma.user.upsert({
    where: { email: "user@dadli.az" },
    update: {},
    create: { name: "Test İstifadəçi", email: "user@dadli.az", passwordHash: userHash, role: "USER" },
  });

  let order = 0;
  for (const c of data) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { name: c.name, slug: c.slug, imageUrl: img(c.slug), sortOrder: order++ },
    });

    const existing = await prisma.product.count({ where: { categoryId: category.id } });
    if (existing > 0) continue;

    await prisma.product.createMany({
      data: c.items.map((name, i) => ({
        categoryId: category.id,
        name,
        description: `${name} — təzə hazırlanmış, dadlı və doyurucu.`,
        price: (5 + i * 1.5 + order).toFixed(2),
        imageUrl: img(name),
        isFeatured: i === 0,
      })),
    });
  }

  console.log("Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());