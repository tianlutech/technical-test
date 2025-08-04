// service/api/products.api.ts

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  writeBatch,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { Product, CreateProductData, UpdateProductData, ProductFilters, productConverter } from '../../types/product.types';
import { auth, db } from '@/firebase/config';

export class ProductsApi {
  private static readonly COLLECTION_NAME = 'products';

  /**
   * Get current user ID
   */
  private static getCurrentUserId(): string {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.uid;
  }

  /**
   * Create a new product
   */
  static async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      const userId = this.getCurrentUserId();
      const productsCollection = collection(db, this.COLLECTION_NAME);

      // Get the current highest order for this user
      const productsQuery = query(
        productsCollection,
        where('userId', '==', userId),
        orderBy('order', 'desc')
      );
      const snapshot = await getDocs(productsQuery);
      const highestOrder = snapshot.empty ? 0 : (snapshot.docs[0].data().order || 0);

      const newProduct = {
        ...productData,
        userId, // <-- Save userId!
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        order: highestOrder + 1
      };

      const docRef = await addDoc(productsCollection, newProduct);

      // Get the created document to return with proper timestamps
      const createdDoc = await getDoc(docRef);
      if (!createdDoc.exists()) {
        throw new Error('Failed to retrieve created product');
      }

      return productConverter.fromFirestore(createdDoc as QueryDocumentSnapshot<DocumentData>, {});
    } catch (error: unknown) {
      console.error('Error creating product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all products for the current user
   */
static async getProducts(filters?: ProductFilters): Promise<Product[]> {
  try {
    const userId = this.getCurrentUserId();
    const productsCollection = collection(db, this.COLLECTION_NAME);

    const productQuery = query(
      productsCollection,
      orderBy('order', 'asc')
    );

    const querySnapshot = await getDocs(productQuery);
    let products = querySnapshot.docs.map(doc => productConverter.fromFirestore(doc, {}));

    // Only show products belonging to the current user
    products = products.filter(product => product.userId === userId);

    // Apply client-side filters if provided
    if (filters) {
      products = this.applyFilters(products, filters);
    }

    return products;
  } catch (error: unknown) {
    console.error('Error fetching products:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
    throw new Error(errorMessage);
  }
}

  /**
   * Update a product
   */
  static async updateProduct(productId: string, updateData: UpdateProductData): Promise<Product> {
    try {
      const userId = this.getCurrentUserId();
      const productRef = doc(db, this.COLLECTION_NAME, productId);
      
      // Verify the product belongs to the current user
      const productDoc = await getDoc(productRef);
      if (!productDoc.exists()) {
        throw new Error('Product not found');
      }
      
      const productData = productDoc.data();
      if (productData.userId !== userId) {
        throw new Error('Product not found');
      }

      const updatePayload = {
        ...updateData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(productRef, updatePayload);
      
      // Get the updated document
      const updatedDoc = await getDoc(productRef);
      return productConverter.fromFirestore(updatedDoc as QueryDocumentSnapshot<DocumentData>, {});
    } catch (error: unknown) {
      console.error('Error updating product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a product
   */
  static async deleteProduct(productId: string): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      const productRef = doc(db, this.COLLECTION_NAME, productId);
      
      // Verify the product belongs to the current user
      const productDoc = await getDoc(productRef);
      if (!productDoc.exists()) {
        throw new Error('Product not found');
      }
      
      const productData = productDoc.data();
      if (productData.userId !== userId) {
        throw new Error('Product not found');
      }
      
      await deleteDoc(productRef);
    } catch (error: unknown) {
      console.error('Error deleting product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get a single product by ID
   */
  static async getProduct(productId: string): Promise<Product> {
    try {
      const userId = this.getCurrentUserId();
      const productRef = doc(db, this.COLLECTION_NAME, productId);
      const productDoc = await getDoc(productRef);
      
      if (!productDoc.exists()) {
        throw new Error('Product not found');
      }
      
      const product = productConverter.fromFirestore(productDoc as QueryDocumentSnapshot<DocumentData>, {});
      
      // Verify the product belongs to the current user
      if (product.userId !== userId) {
        throw new Error('Product not found');
      }
    
      return product;
    } catch (error: unknown) {
      console.error('Error fetching product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
      throw new Error(errorMessage);
    }
  }

  /**
   * Reorder products
   */
  static async reorderProducts(productIds: string[]): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      const batch = writeBatch(db);

      // Verify all products belong to the current user
      for (const productId of productIds) {
        const productRef = doc(db, this.COLLECTION_NAME, productId);
        const productDoc = await getDoc(productRef);
        
        if (!productDoc.exists()) {
          throw new Error('Product not found');
        }
        
        const productData = productDoc.data();
        if (productData.userId !== userId) {
          throw new Error('Product not found');
        }
      }

      // Update each product with its new order
      productIds.forEach((productId, index) => {
        const productRef = doc(db, this.COLLECTION_NAME, productId);
        batch.update(productRef, {
          order: index + 1,
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
    } catch (error: unknown) {
      console.error('Error reordering products:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to reorder products';
      throw new Error(errorMessage);
    }
  }

  /**
   * Apply client-side filters to products
   */
  static applyFilters(products: Product[], filters: ProductFilters): Product[] {
    return products.filter(product => {
      let matches = true;
      
      if (filters.search) {
        matches = matches && product.name.toLowerCase().includes(filters.search.toLowerCase());
      }
      
      if (filters.minPrice !== undefined) {
        matches = matches && product.amount >= filters.minPrice;
      }
      
      if (filters.maxPrice !== undefined) {
        matches = matches && product.amount <= filters.maxPrice;
      }
      
      // Add more filter conditions as needed
      return matches;
    });
  }

  /**
   * Get products count for the current user
   */
  static async getProductsCount(): Promise<number> {
    try {
      const products = await this.getProducts();
      return products.length;
    } catch (error: unknown) {
      console.error('Error fetching products count:', error);
      return 0;
    }
  }
}
