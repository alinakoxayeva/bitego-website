import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";

const router = Router();

const OFFSET = 4 * 60 * 60 * 1000; // Bakı: UTC+4
const DAY = 24 * 60 * 60 * 1000;

function startOfTodayBaku() {
  const local = Date.now() + OFFSET;
  return new Date(Math.floor(local / DAY) * DAY - OFFSET);
}

const dayKey = (d: Date) => new Date(d.getTime() + OFFSET).toISOString().slice(0, 10);

router.get("/summary", async (_req, res) => {
  const todayStart = startOfTodayBaku();
  const weekAgo = new Date(Date.now() - 7 * DAY);

  const [ordersToday, revenueToday, pendingOrders, totalUsers, newUsersThisWeek] =
    await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: todayStart }, status: { not: "CANCELLED" } },
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    ]);

  res.json({
    ordersToday,
    revenueToday: Number(revenueToday._sum.total ?? 0),
    pendingOrders,
    totalUsers,
    newUsersThisWeek,
  });
});

router.get("/revenue", async (req, res) => {
  const { days } = z
    .object({ days: z.coerce.number().int().refine((n) => n === 7 || n === 30).default(7) })
    .parse(req.query);

  const since = new Date(startOfTodayBaku().getTime() - (days - 1) * DAY);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: since }, status: { not: "CANCELLED" } },
    select: { createdAt: true, total: true },
  });

  // Sifarişsiz günlər də 0 ilə görünsün
  const byDay = new Map<string, { revenue: number; orders: number }>();
  for (let i = 0; i < days; i++) {
    byDay.set(dayKey(new Date(since.getTime() + i * DAY)), { revenue: 0, orders: 0 });
  }
  for (const o of orders) {
    const entry = byDay.get(dayKey(o.createdAt));
    if (entry) {
      entry.revenue += Number(o.total);
      entry.orders += 1;
    }
  }

  res.json(
    [...byDay.entries()].map(([date, v]) => ({
      date,
      revenue: Math.round(v.revenue * 100) / 100,
      orders: v.orders,
    })),
  );
});

router.get("/top-products", async (_req, res) => {
  const grouped = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: { order: { status: { not: "CANCELLED" } } },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const products = await prisma.product.findMany({
    where: { id: { in: grouped.map((g) => g.productId) } },
    select: { id: true, name: true },
  });
  const names = new Map(products.map((p) => [p.id, p.name]));

  res.json(
    grouped.map((g) => ({
      productId: g.productId,
      name: names.get(g.productId) ?? "Silinib",
      quantity: g._sum.quantity ?? 0,
    })),
  );
});

router.get("/status-breakdown", async (_req, res) => {
  const grouped = await prisma.order.groupBy({ by: ["status"], _count: { _all: true } });
  res.json(grouped.map((g) => ({ status: g.status, count: g._count._all })));
});

export default router;