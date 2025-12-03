import prisma from "@/src/config/database.config";
import { User, Session } from "@/src/types";
import { SESSION_EXPIRY_DAYS } from "@/src/config/constants.config";

function generateToken(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function loginWithEmail(
  email: string
): Promise<{ user: User; token: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    throw new Error("Invalid email address");
  }

  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { email: normalizedEmail },
    });
  }

  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    },
    token,
  };
}

export async function validateSession(token: string): Promise<User | null> {
  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  if (new Date() > session.expiresAt) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    createdAt: session.user.createdAt.toISOString(),
  };
}

export async function logout(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  const session = await prisma.session.findUnique({
    where: { token },
  });

  if (!session) {
    return false;
  }

  await prisma.session.delete({ where: { id: session.id } });
  return true;
}

export async function getCurrentUser(token: string): Promise<User | null> {
  return validateSession(token);
}
