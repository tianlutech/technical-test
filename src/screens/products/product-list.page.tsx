'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/auth.context';
import { ProtectedRoute } from '../../components/protected-route.component';
import { ProductsApi } from '../../service/api/products.api';
import { Product, CreateProductData, UpdateProductData } from '../../types/product.types';
import { Button } from '../../layout/forms/button.layout';
import { ProductItem } from '../components/product-item.component';
import { AddProductModal } from '../components/add-product-modal.component';
import toast from 'react-hot-toast';

export const ProductListPage: React.FC = () => {
  const { user, logout } = useAuthContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await ProductsApi.getProducts();
      setProducts(fetchedProducts);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load products';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData: CreateProductData) => {
    try {
      const newProduct = await ProductsApi.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      setShowAddModal(false);
      toast.success('Product added successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add product';
      toast.error(errorMessage);
    }
  };

  const handleUpdateProduct = async (productId: string, productData: UpdateProductData) => {
    try {
      const updatedProduct = await ProductsApi.updateProduct(productId, productData);
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      setEditingProduct(null);
      toast.success('Product updated successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
      toast.error(errorMessage);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await ProductsApi.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      toast.error(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Product List
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                      Welcome, {user?.displayName || user?.email}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setShowAddModal(true)}
                      variant="primary"
                    >
                      Add Product
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="secondary"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product List */}
              <div className="p-6">
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No products yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start by adding your first product to the list.
                    </p>
                    <Button
                      onClick={() => setShowAddModal(true)}
                      variant="primary"
                    >
                      Add Your First Product
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <ProductItem
                        key={product.id}
                        product={product}
                        onDelete={handleDeleteProduct}
                        isEditing={editingProduct?.id === product.id}
                        onEditStart={() => setEditingProduct(product)}
                        onEditCancel={() => setEditingProduct(null)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <AddProductModal
            onAdd={handleAddProduct}
            onClose={() => setShowAddModal(false)}
            submitLabel="Add Product"
          />
        )}

        {editingProduct && (
          <AddProductModal
            onAdd={productData => handleUpdateProduct(editingProduct.id, productData)}
            onClose={() => setEditingProduct(null)}
            initialValues={{
              name: editingProduct.name,
              amount: editingProduct.amount,
              comment: editingProduct.comment
            }}
            submitLabel="Save Changes"
          />
        )}
      </div>
    </ProtectedRoute>
  );
};
