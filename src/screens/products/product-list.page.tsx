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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalValue = products.reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout userEmail={userEmail} onLogout={handleLogout}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0d0d0d] mb-1">Products</h1>
        <p className="text-sm text-[#8e8e8e]">
          {products.length} items · ${totalValue.toFixed(2)} total
        </p>
      </div>

      {/* Add Product */}
      {!showAddForm ? (
        <div className="mb-6">
          <Button onClick={() => setShowAddForm(true)}>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New product
            </span>
          </Button>
        </div>
      ) : (
        <div className="mb-6 p-5 border border-[#e5e5e5] rounded-xl bg-[#fafafa]">
          <h3 className="text-sm font-medium text-[#0d0d0d] mb-4">New Product</h3>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <Input
              label="Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Product name"
              required
            />
            <Input
              label="Amount"
              type="number"
              step="0.01"
              value={newProduct.amount}
              onChange={(e) => setNewProduct({ ...newProduct, amount: e.target.value })}
              placeholder="0.00"
              required
            />
            <Textarea
              label="Comment"
              value={newProduct.comment}
              onChange={(e) => setNewProduct({ ...newProduct, comment: e.target.value })}
              placeholder="Optional..."
              rows={2}
            />
            <div className="flex gap-3 pt-2">
              <Button type="submit">Add</Button>
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

      {/* Products List */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#8e8e8e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-[#8e8e8e] text-sm">No products yet</p>
        </div>
      ) : (
        <div className="space-y-2" onDragEnd={handleDragEnd}>
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
