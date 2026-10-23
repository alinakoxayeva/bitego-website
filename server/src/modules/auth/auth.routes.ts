import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, "Ad ən azı 2 simvol olmalıdır"),
  email: z.string().email("Email düzgün deyil"),
  phone: z.string().optional(),
  password: z.string().min(6, "Şifrə ən azı 6 simvol olmalıdır"),
});

const loginSchema = z.object({
  email: z.string().email("Email düzgün deyil"),
  password: z.string().min(1, "Şifrə yazın"),
});

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 50 });

function signToken(user: { id: string; role: string }) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

function publicUser(user: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}) {
  return { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role };
}

router.post("/register", async (req, res) => {
  const data = registerSchema.parse(req.body);

  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) return res.status(409).json({ message: "Bu email artıq qeydiyyatdan keçib" });

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash: await bcrypt.hash(data.password, 10),
      // rol həmişə USER-dir, clientdən rol qəbul edilmir
    },
  });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post("/login", loginLimiter, async (req, res) => {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  const ok = user && (await bcrypt.compare(data.password, user.passwordHash));
  if (!user || !ok) {
    return res.status(401).json({ message: "Email və ya şifrə yanlışdır" });
  }
  if (user.isBlocked) return res.status(403).json({ message: "Hesabınız bloklanıb" });

  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  res.json({ user: publicUser(user!) });
});

export default router;