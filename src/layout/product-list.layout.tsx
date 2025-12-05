import React from 'react';
import { Button } from './button.layout';

interface ProductListLayoutProps {
  count: number;
  isEmpty: boolean;
  onAddClick: () => void;
  onDragEnd?: () => void;
  children: React.ReactNode;
}

export const ProductListLayout: React.FC<ProductListLayoutProps> = ({ count, isEmpty, onAddClick, onDragEnd, children }) => {
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-neutral-900">All Products</h2>
          <span className="text-xs text-neutral-500">{count} item{count !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {isEmpty ? (
        <div className="text-center py-20 px-4">
          <div className="w-12 h-12 rounded-full border-2 border-neutral-200 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-neutral-900 font-medium mb-1">No products yet</p>
          <p className="text-neutral-400 text-sm mb-5">Get started by adding your first product</p>
          <Button onClick={onAddClick} size="sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </span>
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200" onDragEnd={onDragEnd}>{children}</div>
      )}
    </div>
  );
};

