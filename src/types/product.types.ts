// types/product.types.ts

import { 
  DocumentData, 
  QueryDocumentSnapshot, 
  SnapshotOptions,
  Timestamp 
} from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  amount: number;
  comment: string;
  userId: string; // To associate products with users
  order?: number; // For reordering functionality
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductData {
  name: string;
  amount: number;
  comment: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  updatedAt?: Date;
}

export interface ProductFilters {
  category?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Firebase document data interface for Firestore storage
interface ProductFirestoreData extends Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Firebase document converter
export const productConverter = {
  toFirestore(product: Omit<Product, 'id'>): ProductFirestoreData {
    return {
      ...product,
      createdAt: Timestamp.fromDate(product.createdAt),
      updatedAt: Timestamp.fromDate(product.updatedAt),
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>, 
    options: SnapshotOptions
  ): Product {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      amount: data.amount,
      comment: data.comment,
      userId: data.userId,
      order: data.order,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
};
