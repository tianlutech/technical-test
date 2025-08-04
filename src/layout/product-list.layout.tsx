import React from 'react';
import { Product } from '../frontend-service/api-client';

interface ProductListProps {
  products: Product[];
  loading?: boolean;
}

export function ProductList({ products, loading }: ProductListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center text-gray-500">Loading products...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center text-gray-500">
          No products yet. Your product list is empty.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          My Products ({products.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {products.map((product) => (
          <div key={product.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900">
                  {product.name}
                </h4>
                <p className="text-2xl font-semibold text-green-600 mt-1">
                  ${product.amount.toFixed(2)}
                </p>
                {product.comment && (
                  <p className="text-sm text-gray-600 mt-2">
                    {product.comment}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}