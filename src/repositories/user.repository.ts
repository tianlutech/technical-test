import { prisma } from '@/src/models/prisma';

export const userRepository = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  create: (email: string) => prisma.user.create({ data: { email } }),
};
