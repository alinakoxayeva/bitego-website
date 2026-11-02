import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import ordersRouter from "./orders.routes.js"
import productsRouter from "./products.routes.js";
import categoriesRouter from "./categories.routes.js";
import usersRouter from "./users.routes.js";
import statsRouter from "./stats.routes.js";

const router = Router();

router.use(requireAuth, requireRole("ADMIN"));

router.use("/orders", ordersRouter);
router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/users", usersRouter);
router.use("/stats", statsRouter);

export default router;