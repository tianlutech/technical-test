// Backend service layer - handles business logic between API routes and database
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Product {
  id: string;
  name: string;
  amount: number;
  comment: string | null;
  order: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductData {
  name: string;
  amount: number;
  comment?: string | null;
  userId: string;
}

export interface UpdateProductData {
  name?: string;
  amount?: number;
  comment?: string | null;
}

export class ProductService {
  /**
   * Get all products for a specific user, ordered by order
   */
  static async getUserProducts(userId: string): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany({
        where: { userId },
        orderBy: { order: 'desc' }
      });
      return products;
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Create a new product for a user
   */
  static async createProduct(data: CreateProductData): Promise<Product> {
    try {
      // Get the highest order number for this user to append new product at the end
      const lastProduct = await prisma.product.findFirst({
        where: { userId: data.userId },
        orderBy: { order: 'desc' }
      });

      const newOrder = lastProduct ? lastProduct.order + 1 : 1;

      const product = await prisma.product.create({
        data: {
          name: data.name.trim(),
          amount: data.amount,
          comment: data.comment ? data.comment.trim() : null,
          order: newOrder,
          userId: data.userId
        }
      });

      return product;
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Find a product by ID and ensure it belongs to the user
   */
  static async findUserProduct(productId: string, userId: string): Promise<Product | null> {
    try {
      const product = await prisma.product.findFirst({
        where: { 
          id: productId,
          userId: userId 
        }
      });
      return product;
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Update a product by ID
   */
  static async updateProduct(productId: string, data: UpdateProductData): Promise<Product> {
    try {
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          ...(data.name !== undefined && { name: data.name.trim() }),
          ...(data.amount !== undefined && { amount: data.amount }),
          ...(data.comment !== undefined && { comment: data.comment ? data.comment.trim() : null })
        }
      });
      return updatedProduct;
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Delete a product by ID
   */
  static async deleteProduct(productId: string): Promise<void> {
    try {
      await prisma.product.delete({
        where: { id: productId }
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Reorder products for a user
   */
  static async reorderProducts(
    userId: string, 
    productUpdates: Array<{ id: string; order: number }>
  ): Promise<Product[]> {
    try {
      // Verify all products belong to the user
      const productIds = productUpdates.map(p => p.id);
      const existingProducts = await prisma.product.findMany({
        where: {
          id: { in: productIds },
          userId: userId
        }
      });

      if (existingProducts.length !== productIds.length) {
        throw new Error('One or more products do not belong to the user');
      }

      // Update each product's order in a transaction
      const updatePromises = productUpdates.map(({ id, order }) =>
        prisma.product.update({
          where: { id },
          data: { order }
        })
      );

      await prisma.$transaction(updatePromises);

      // Return all user's products in the new order
      return await this.getUserProducts(userId);
    } finally {
      await prisma.$disconnect();
    }
  }
}
