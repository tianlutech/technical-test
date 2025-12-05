import { productRepository } from '@/src/repositories/product.repository';
import { CreateProductDto, UpdateProductDto, ReorderProductsDto } from '@/src/validators/product.validator';

export const productService = {
  async getProducts(userId: string) {
    return productRepository.findByUserId(userId);
  },

  async getProduct(id: string, userId: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }
    if (product.userId !== userId) {
      throw new Error('UNAUTHORIZED');
    }
    return product;
  },

  async createProduct(userId: string, data: CreateProductDto) {
    return productRepository.create(userId, data);
  },

  async updateProduct(id: string, userId: string, data: UpdateProductDto) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }
    if (product.userId !== userId) {
      throw new Error('UNAUTHORIZED');
    }
    return productRepository.update(id, data);
  },

  async deleteProduct(id: string, userId: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }
    if (product.userId !== userId) {
      throw new Error('UNAUTHORIZED');
    }
    return productRepository.delete(id);
  },

  async reorderProducts(userId: string, data: ReorderProductsDto) {
    const products = await productRepository.findByUserId(userId);
    const productIds = new Set(products.map((p) => p.id));

    const allValid = data.productIds.every((id) => productIds.has(id));
    if (!allValid || data.productIds.length !== products.length) {
      throw new Error('INVALID_REORDER');
    }

    return productRepository.reorder(userId, data.productIds);
  },
};

