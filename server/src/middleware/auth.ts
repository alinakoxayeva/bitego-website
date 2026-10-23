import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Giriş tələb olunur" });
  }

  let user;
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as jwt.JwtPayload;
    user = await prisma.user.findUnique({ where: { id: String(payload.sub) } });
  } catch {
    return res.status(401).json({ message: "Token etibarsızdır" });
  }

  if (!user) return res.status(401).json({ message: "İstifadəçi tapılmadı" });
  if (user.isBlocked) return res.status(403).json({ message: "Hesabınız bloklanıb" });

  req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
  next();
}

export const requireRole =
  (role: "USER" | "ADMIN") => (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: "Bu əməliyyat üçün icazəniz yoxdur" });
    }
    next();
  };