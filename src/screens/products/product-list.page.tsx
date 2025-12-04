import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/src/layout/dashboard.layout';
import { Card } from '@/src/layout/card.layout';
import { Button } from '@/src/layout/button.layout';
import { Input } from '@/src/layout/input.layout';
import { Textarea } from '@/src/layout/textarea.layout';
import { Text } from '@/src/layout/text.layout';
import { ProductItem } from '@/src/layout/product-item.layout';
import { productApi, Product } from '@/src/service/fetch/product.api';
import { authApi } from '@/src/service/fetch/auth.api';
import { ApiError } from '@/src/service/fetch/api-client';

export default function ProductListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', amount: '', comment: '' });
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    loadProducts();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await authApi.getMe();
      setUserEmail(user.email);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push('/');
      }
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productApi.getProducts();
      setProducts(data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newProduct.amount);
    if (!newProduct.name.trim() || isNaN(amount) || amount <= 0) {
      return;
    }

    try {
      const product = await productApi.createProduct({
        name: newProduct.name.trim(),
        amount,
        comment: newProduct.comment.trim() || undefined,
      });
      setProducts([...products, product]);
      setNewProduct({ name: '', amount: '', comment: '' });
      setShowAddForm(false);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push('/');
      }
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = async (id: string, data: { name: string; amount: number; comment: string }) => {
    try {
      const updated = await productApi.updateProduct(id, data);
      setProducts(products.map((p) => (p.id === id ? updated : p)));
      setEditingId(null);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push('/');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productApi.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push('/');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore errors, still redirect
    }
    router.push('/');
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== draggedId) {
      setDragOverId(id);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);

    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const draggedIndex = products.findIndex((p) => p.id === draggedId);
    const targetIndex = products.findIndex((p) => p.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedId(null);
      return;
    }

    const newProducts = [...products];
    const [removed] = newProducts.splice(draggedIndex, 1);
    newProducts.splice(targetIndex, 0, removed);

    setProducts(newProducts);
    setDraggedId(null);

    try {
      await productApi.reorderProducts({
        productIds: newProducts.map((p) => p.id),
      });
    } catch (error) {
      loadProducts();
      if (error instanceof ApiError && error.status === 401) {
        router.push('/');
      }
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <Text variant="body" className="text-slate-500">Loading...</Text>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout userEmail={userEmail} onLogout={handleLogout}>
      {/* Header */}
      <div className="mb-8">
        <Text variant="h2" className="text-slate-800 mb-2">
          My Products
        </Text>
        <Text variant="small" className="text-slate-500">
          Manage your product list. Drag items to reorder.
        </Text>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-5 bg-gradient-to-br from-orange-500 to-orange-600 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Products</p>
              <p className="text-white text-3xl font-bold mt-1">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-slate-700 to-slate-800 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm font-medium">Total Value</p>
              <p className="text-white text-3xl font-bold mt-1">
                ${products.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Average Value</p>
              <p className="text-white text-3xl font-bold mt-1">
                ${products.length > 0 ? (products.reduce((sum, p) => sum + p.amount, 0) / products.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Product Section */}
      {!showAddForm ? (
        <div className="mb-6">
          <Button onClick={() => setShowAddForm(true)} className="bg-orange-500 hover:bg-orange-600 focus:ring-orange-500">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </span>
          </Button>
        </div>
      ) : (
        <Card className="p-6 mb-6 border-2 border-orange-200 bg-orange-50/50">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Product</h3>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <Input
              label="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Enter product name"
              required
            />
            <Input
              label="Amount ($)"
              type="number"
              step="0.01"
              value={newProduct.amount}
              onChange={(e) => setNewProduct({ ...newProduct, amount: e.target.value })}
              placeholder="0.00"
              required
            />
            <Textarea
              label="Comment (optional)"
              value={newProduct.comment}
              onChange={(e) => setNewProduct({ ...newProduct, comment: e.target.value })}
              placeholder="Add a comment..."
              rows={2}
            />
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 focus:ring-orange-500">
                Add Product
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowAddForm(false);
                  setNewProduct({ name: '', amount: '', comment: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Products List */}
      {products.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <Text variant="body" className="text-slate-500 mb-2">
            No products yet
          </Text>
          <Text variant="small" className="text-slate-400">
            Click "Add Product" to create your first item
          </Text>
        </Card>
      ) : (
        <div className="space-y-3" onDragEnd={handleDragEnd}>
          {products.map((product) => (
            <ProductItem
              key={product.id}
              id={product.id}
              name={product.name}
              amount={product.amount}
              comment={product.comment}
              isEditing={editingId === product.id}
              onEdit={() => handleEdit(product.id)}
              onSave={(data) => handleSave(product.id, data)}
              onCancel={handleCancel}
              onDelete={() => handleDelete(product.id)}
              onDragStart={(e) => handleDragStart(e, product.id)}
              onDragOver={(e) => handleDragOver(e, product.id)}
              onDrop={(e) => handleDrop(e, product.id)}
              dragOver={dragOverId === product.id}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

