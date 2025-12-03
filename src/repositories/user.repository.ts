import { prisma } from '@/src/models/prisma';

export const userRepository = {
  findByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  create: (email: string) => {
    return prisma.user.create({
      data: { email },
    });
  },

  findById: (id: string) => {
    return prisma.user.findUnique({
      where: { id },
    });
  },
};

