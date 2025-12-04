import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/src/layout/dashboard.layout';
import { PageLoader } from '@/src/layout/page-loader.layout';
import { PageHeader } from '@/src/layout/page-header.layout';
import { ProductForm } from '@/src/layout/product-form.layout';
import { ProductListLayout } from '@/src/layout/product-list.layout';
import { ProductItem } from '@/src/layout/product-item.layout';
import { productApi, Product } from '@/src/service/fetch/product.api';
import { authApi } from '@/src/service/fetch/auth.api';

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
    authApi.getMe().then((user) => setUserEmail(user.email));
    productApi.getProducts().then(setProducts).finally(() => setIsLoading(false));
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newProduct.amount);
    if (!newProduct.name.trim() || isNaN(amount) || amount <= 0) return;

    productApi.createProduct({
      name: newProduct.name.trim(),
      amount,
      comment: newProduct.comment.trim() || undefined,
    }).then((product) => {
      setProducts([...products, product]);
      setNewProduct({ name: '', amount: '', comment: '' });
      setShowAddForm(false);
    });
  };

  const handleSave = (id: string, data: { name: string; amount: number; comment: string }) => {
    productApi.updateProduct(id, data).then((updated) => {
      setProducts(products.map((p) => (p.id === id ? updated : p)));
      setEditingId(null);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this product?')) return;
    productApi.deleteProduct(id).then(() => {
      setProducts(products.filter((p) => p.id !== id));
    });
  };

  const handleLogout = () => {
    authApi.logout().finally(() => router.push('/'));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== draggedId) setDragOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
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

    productApi.reorderProducts({ productIds: newProducts.map((p) => p.id) });
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setNewProduct({ name: '', amount: '', comment: '' });
  };

  if (isLoading) return <PageLoader />;

  return (
    <DashboardLayout userEmail={userEmail} onLogout={handleLogout}>
      {!showAddForm && (
        <PageHeader
          title="Products"
          subtitle="Manage your product inventory"
          action={{ label: 'Add Product', onClick: () => setShowAddForm(true) }}
        />
      )}

      {showAddForm && (
        <>
          <PageHeader title="Products" subtitle="Manage your product inventory" />
          <ProductForm
            data={newProduct}
            onChange={setNewProduct}
            onSubmit={handleAddProduct}
            onCancel={handleCancelForm}
          />
        </>
      )}

      <ProductListLayout
        count={products.length}
        isEmpty={products.length === 0}
        onAddClick={() => setShowAddForm(true)}
        onDragEnd={handleDragEnd}
      >
        {products.map((product) => (
          <ProductItem
            key={product.id}
            name={product.name}
            amount={product.amount}
            comment={product.comment}
            isEditing={editingId === product.id}
            onEdit={() => setEditingId(product.id)}
            onSave={(data) => handleSave(product.id, data)}
            onCancel={() => setEditingId(null)}
            onDelete={() => handleDelete(product.id)}
            onDragStart={(e) => handleDragStart(e, product.id)}
            onDragOver={(e) => handleDragOver(e, product.id)}
            onDrop={(e) => handleDrop(e, product.id)}
            dragOver={dragOverId === product.id}
          />
        ))}
      </ProductListLayout>
    </DashboardLayout>
  );
}
