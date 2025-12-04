import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/src/layout/dashboard.layout';
import { Button } from '@/src/layout/button.layout';
import { Input } from '@/src/layout/input.layout';
import { Textarea } from '@/src/layout/textarea.layout';
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
    if (!confirm('Delete this product?')) {
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
      // Ignore errors
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-amber-500/50 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalValue = products.reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout userEmail={userEmail} onLogout={handleLogout}>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Products</h1>
            <p className="text-sm text-neutral-500">Manage your product inventory</p>
          </div>
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)}>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Product
              </span>
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Total Items</p>
            <p className="text-2xl font-semibold text-neutral-900">{products.length}</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Total Value</p>
            <p className="text-2xl font-semibold text-neutral-900">${totalValue.toFixed(2)}</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Average</p>
            <p className="text-2xl font-semibold text-neutral-900">
              ${products.length > 0 ? (totalValue / products.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="mb-6 bg-white border border-neutral-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-medium text-neutral-900">New Product</h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewProduct({ name: '', amount: '', comment: '' });
              }}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <Textarea
              label="Comment (optional)"
              value={newProduct.comment}
              onChange={(e) => setNewProduct({ ...newProduct, comment: e.target.value })}
              placeholder="Add any notes about this product..."
              rows={2}
            />
            <div className="flex gap-3 pt-2">
              <Button type="submit">Add Product</Button>
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
        </div>
      )}

      {/* Products Section */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-neutral-900">All Products</h2>
            <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
              {products.length} item{products.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-neutral-900 font-medium mb-1">No products yet</p>
            <p className="text-neutral-500 text-sm mb-4">Get started by adding your first product</p>
            {!showAddForm && (
              <Button onClick={() => setShowAddForm(true)} size="sm">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Product
                </span>
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-neutral-100" onDragEnd={handleDragEnd}>
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
      </div>
    </DashboardLayout>
  );
}
