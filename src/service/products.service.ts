import { ProductsCollection } from '../firebase/collections/products.collection';
import { Product, CreateProductData, UpdateProductData } from '../types/product.types';

export class ProductsService {
  /**
   * Get all products for a user
   */
  static async getUserProducts(userId: string): Promise<Product[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    return await ProductsCollection.getUserProducts(userId);
  }

  /**
   * Get a single product
   */
  static async getProduct(productId: string, userId: string): Promise<Product | null> {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const product = await ProductsCollection.getProduct(productId);
    
    // Ensure user can only access their own products
    if (product && product.userId !== userId) {
      throw new Error('Product not found');
    }
    
    return product;
  }

  /**
   * Create a new product
   */
  static async createProduct(userId: string, productData: CreateProductData): Promise<Product> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (!productData.name || productData.name.trim().length === 0) {
      throw new Error('Product name is required');
    }
    
    if (productData.amount < 0) {
      throw new Error('Amount must be a positive number');
    }
    
    return await ProductsCollection.createProduct(userId, {
      name: productData.name.trim(),
      amount: productData.amount,
      comment: productData.comment || '',
    });
  }

  /**
   * Update a product
   */
  static async updateProduct(productId: string, userId: string, productData: UpdateProductData): Promise<Product> {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    // Verify product exists and belongs to user
    const existingProduct = await ProductsCollection.getProduct(productId);
    if (!existingProduct || existingProduct.userId !== userId) {
      throw new Error('Product not found');
    }
    
    // Validate update data
    if (productData.name !== undefined && productData.name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    
    if (productData.amount !== undefined && productData.amount < 0) {
      throw new Error('Amount must be a positive number');
    }
    
    const updateData: UpdateProductData = {};
    if (productData.name !== undefined) {
      updateData.name = productData.name.trim();
    }
    if (productData.amount !== undefined) {
      updateData.amount = productData.amount;
    }
    if (productData.comment !== undefined) {
      updateData.comment = productData.comment;
    }
    
    return await ProductsCollection.updateProduct(productId, updateData);
  }

  /**
   * Delete a product
   */
  static async deleteProduct(productId: string, userId: string): Promise<void> {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    // Verify product exists and belongs to user
    const existingProduct = await ProductsCollection.getProduct(productId);
    if (!existingProduct || existingProduct.userId !== userId) {
      throw new Error('Product not found');
    }
    
    await ProductsCollection.deleteProduct(productId);
  }

  /**
   * Reorder products
   */
  static async reorderProducts(userId: string, productIds: string[]): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (!productIds || productIds.length === 0) {
      throw new Error('Product IDs are required');
    }
    
    // Verify all products belong to the user
    const userProducts = await ProductsCollection.getUserProducts(userId);
    const userProductIds = userProducts.map(p => p.id);
    
    for (const productId of productIds) {
      if (!userProductIds.includes(productId)) {
        throw new Error('Invalid product ID');
      }
    }
    
    await ProductsCollection.reorderProducts(userId, productIds);
  }
}
