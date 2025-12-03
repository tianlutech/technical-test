import { apiGet, apiPost, apiPut, apiDelete } from './api-client';
import { CreateProductDto, UpdateProductDto, ReorderProductsDto } from '@/src/validators/product.validator';

export interface Product {
  id: string;
  name: string;
  amount: number;
  comment: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const productApi = {
  getProducts: () => apiGet<Product[]>('/api/products'),
  getProduct: (id: string) => apiGet<Product>(`/api/products/${id}`),
  createProduct: (data: CreateProductDto) => apiPost<Product>('/api/products', data),
  updateProduct: (id: string, data: UpdateProductDto) => apiPut<Product>(`/api/products/${id}`, data),
  deleteProduct: (id: string) => apiDelete<void>(`/api/products/${id}`),
  reorderProducts: (data: ReorderProductsDto) => apiPut<void>('/api/products/reorder', data),
};

