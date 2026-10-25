import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./modules/auth/auth.routes.js";
import { errorHandler } from "./middleware/error.js";
import catalogRouter from "./modules/catalog/catalog.routes.js";

const app = express();

app.use(helmet());
app.use("/api", catalogRouter);
app.use(cors({ origin: process.env.CLIENT_URL ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);

app.use(errorHandler);

export default app;