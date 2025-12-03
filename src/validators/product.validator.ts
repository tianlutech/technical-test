import { z } from 'zod';

export const createProductValidator = z.object({
  name: z.string().min(1, 'Product name is required'),
  amount: z.number().positive('Amount must be positive'),
  comment: z.string().optional(),
});

export type CreateProductDto = z.infer<typeof createProductValidator>;

export const updateProductValidator = z.object({
  name: z.string().min(1, 'Product name is required').optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  comment: z.string().optional(),
});

export type UpdateProductDto = z.infer<typeof updateProductValidator>;

export const reorderProductsValidator = z.object({
  productIds: z.array(z.string()).min(1, 'Product IDs are required'),
});

export type ReorderProductsDto = z.infer<typeof reorderProductsValidator>;

