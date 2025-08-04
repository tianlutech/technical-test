import { useState, useEffect } from 'react';
import { Product, CreateProductRequest } from '../frontend-service/api-client';
import { Button } from '../layout/button.layout';
import { ProductList } from '../layout/product-list.layout';
import { ProductForm } from '../layout/product-form.layout';
import { ConfirmDialog } from '../layout/confirm-dialog.layout';
import { useAuth } from '../hooks/use-auth.hook';
import { useProducts } from '../hooks/use-products.hook';

export default function MainPage() {
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  
  const { logout, redirectToLogin } = useAuth();
  const {
    products,
    loading,
    error,
    creating,
    updating,
    deleting,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct: deleteProductApi,
    clearError,
  } = useProducts(redirectToLogin);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const handleFormSubmit = async (productData: CreateProductRequest) => {
    if (editProduct) {
      await updateProduct(editProduct.id, productData);
      setShowForm(false);
      setEditProduct(null);
    } else {
      await createProduct(productData);
      setShowForm(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeleteProduct(product);
  };

  const handleConfirmDelete = async () => {
    if (!deleteProduct) return;
    
    await deleteProductApi(deleteProduct.id);
    setDeleteProduct(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditProduct(null);
  };

  const handleCancelDelete = () => {
    setDeleteProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <div className="flex gap-3">
            <Button onClick={() => setShowForm(true)} disabled={showForm || !!editProduct}>
              Add Product
            </Button>
            <Button onClick={logout} variant="secondary" size="sm">
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
              onSubmit={handleFormSubmit}
              loading={creating || updating}
              onCancel={handleCancelForm}
              editProduct={editProduct}
            />
          </div>
        )}

        {/* Products List */}
        <ProductList 
          products={products} 
          loading={loading} 
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />

        {/* Delete Confirmation Dialog */}
        {deleteProduct && (
          <ConfirmDialog
            title="Delete Product"
            message={`Are you sure you want to delete "${deleteProduct.name}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            loading={deleting}
            variant="danger"
          />
        )}
      </div>
    </div>
  );
}
