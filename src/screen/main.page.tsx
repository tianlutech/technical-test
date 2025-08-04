import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiClient, Product, CreateProductRequest } from '../frontend-service/api-client';
import { Button } from '../layout/button.layout';
import { ProductList } from '../layout/product-list.layout';
import { ProductForm } from '../layout/product-form.layout';

export default function MainPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  // Auth check
  useEffect(() => {
    const token = apiClient.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    loadProducts();
  }, [router]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiClient.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      // If unauthorized, redirect to login
      if (err instanceof Error && err.message.includes('token')) {
        apiClient.clearToken();
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiClient.logout();
    router.push('/login');
  };

  const handleCreateProduct = async (productData: CreateProductRequest) => {
    try {
      setCreating(true);
      setError('');
      
      const newProduct = await apiClient.createProduct(productData);
      
      // Add new product to the list and sort by order
      setProducts(prev => [...prev, newProduct].sort((a, b) => a.order - b.order));
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      // If unauthorized, redirect to login
      if (err instanceof Error && err.message.includes('token')) {
        apiClient.clearToken();
        router.push('/login');
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <div className="flex gap-3">
            <Button onClick={() => setShowForm(true)} disabled={showForm}>
              Add Product
            </Button>
            <Button onClick={handleLogout} variant="secondary" size="sm">
              Logout
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Product Form */}
        {showForm && (
          <div className="mb-6">
            <ProductForm
              onSubmit={handleCreateProduct}
              loading={creating}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Products List */}
        <ProductList products={products} loading={loading} />
      </div>
    </div>
  );
}
