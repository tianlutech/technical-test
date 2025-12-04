import { prisma } from "@/config/database";

export interface CreateProductData {
  name: string;
  amount: number;
  comment?: string;
  userId: string;
}

export interface UpdateProductData {
  name?: string;
  amount?: number;
  comment?: string;
}

export const productService = {
  async getUserProducts(userId: string) {
    return await prisma.product.findMany({
      where: { userId },
      orderBy: { order: "asc" },
    });
  },

  async getProductById(id: string, userId: string) {
    return await prisma.product.findFirst({
      where: { id, userId },
    });
  },

  async createProduct(data: CreateProductData) {
    const maxOrder = await prisma.product.findFirst({
      where: { userId: data.userId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = maxOrder ? maxOrder.order + 1 : 0;

    return await prisma.product.create({
      data: {
        name: data.name,
        amount: data.amount,
        comment: data.comment,
        userId: data.userId,
        order: newOrder,
      },
    });
  },

  async updateProduct(id: string, userId: string, data: UpdateProductData) {
    const product = await prisma.product.findFirst({
      where: { id, userId },
    });

    if (!product) {
      return null;
    }

    return await prisma.product.update({
      where: { id },
      data,
    });
  },

  async deleteProduct(id: string, userId: string) {
    const product = await prisma.product.findFirst({
      where: { id, userId },
    });

    if (!product) {
      return null;
    }

    await prisma.product.delete({
      where: { id },
    });

    await prisma.product.updateMany({
      where: {
        userId,
        order: { gt: product.order },
      },
      data: {
        order: { decrement: 1 },
      },
    });

    return product;
  },

  async reorderProducts(userId: string, productIds: string[]) {
    const products = await prisma.product.findMany({
      where: { userId, id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return null;
    }

    await prisma.$transaction(
      productIds.map((id, index) =>
        prisma.product.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return await prisma.product.findMany({
      where: { userId },
      orderBy: { order: "asc" },
    });
  },
};
