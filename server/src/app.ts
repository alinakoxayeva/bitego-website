import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./modules/auth/auth.routes.js";
import catalogRouter from "./modules/catalog/catalog.routes.js";
import { errorHandler } from "./middleware/error.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""));

// Dev-də istənilən localhost portuna icazə (Vite 5173 məşğul olsa 5174 açır)
const isLocalhost = (origin: string) => /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || isLocalhost(origin)) {
        return callback(null, true);
      }
      callback(new Error("CORS: bu ünvana icazə yoxdur"));
    },
  }),
);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api", catalogRouter);

app.use(errorHandler);

export default app;