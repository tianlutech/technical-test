import { prisma } from '@/src/models/prisma';
import { CreateProductDto, UpdateProductDto } from '@/src/validators/product.validator';

export const productRepository = {
  findByUserId: (userId: string) => {
    return prisma.product.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
  },

  findById: (id: string) => {
    return prisma.product.findUnique({
      where: { id },
    });
  },

  create: (userId: string, data: CreateProductDto) => {
    return prisma.$transaction(async (tx) => {
      const maxOrder = await tx.product.findFirst({
        where: { userId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });

      const nextOrder = (maxOrder?.order ?? -1) + 1;

      return tx.product.create({
        data: {
          ...data,
          userId,
          order: nextOrder,
        },
      });
    });
  },

  update: (id: string, data: UpdateProductDto) => {
    return prisma.product.update({
      where: { id },
      data,
    });
  },

  delete: (id: string) => {
    return prisma.product.delete({
      where: { id },
    });
  },

  reorder: (userId: string, productIds: string[]) => {
    return prisma.$transaction(
      productIds.map((id, index) =>
        prisma.product.update({
          where: { id },
          data: { order: index },
        })
      )
    );
  },
};

