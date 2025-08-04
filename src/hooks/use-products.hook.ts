// Custom hook for product operations - handles all API calls and error handling
import { useState } from 'react';
import { apiClient, Product, CreateProductRequest, UpdateProductRequest } from '../frontend-service/api-client';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  loadProducts: () => Promise<void>;
  createProduct: (productData: CreateProductRequest) => Promise<void>;
  updateProduct: (productId: string, productData: CreateProductRequest) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  clearError: () => void;
}

export function useProducts(onAuthError: () => void): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAuthError = (err: Error) => {
    if (err.message.includes('token')) {
      apiClient.clearToken();
      onAuthError();
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiClient.getProducts();
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      if (err instanceof Error) {
        handleAuthError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: CreateProductRequest) => {
    try {
      setCreating(true);
      setError('');
      
      const newProduct = await apiClient.createProduct(productData);
      setProducts(prev => [...prev, newProduct].sort((a, b) => a.order - b.order));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      if (err instanceof Error) {
        handleAuthError(err);
      }
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const updateProduct = async (productId: string, productData: CreateProductRequest) => {
    try {
      setUpdating(true);
      setError('');
      
      const updatedProduct = await apiClient.updateProduct(productId, productData as UpdateProductRequest);
      setProducts(prev => 
        prev.map(p => p.id === productId ? updatedProduct : p)
          .sort((a, b) => a.order - b.order)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      if (err instanceof Error) {
        handleAuthError(err);
      }
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      setDeleting(true);
      setError('');
      
      await apiClient.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      if (err instanceof Error) {
        handleAuthError(err);
      }
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  const clearError = () => setError('');

  return {
    products,
    loading,
    error,
    creating,
    updating,
    deleting,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
  };
}
