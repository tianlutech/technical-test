"use client";

import React, { useState } from "react";
import { Product } from "../../types/product.types";
import { Button } from "../../layout/forms/button.layout";
import { Popconfirm } from "antd";

interface ProductItemProps {
  product: Product;
  onDelete: (productId: string) => Promise<void>;
  onEditStart: () => void;
  onEditCancel: () => void;
  isEditing: boolean;
}

export const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onDelete,
  onEditStart,
  onEditCancel,
  isEditing,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(product.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-white border rounded-lg p-6 shadow-sm transition-shadow ${
        isEditing
          ? "border-blue-500 shadow-md"
          : "border-gray-200 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {product.name}
          </h3>
          {product.comment && (
            <p className="text-sm text-gray-600 mt-1">{product.comment}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="font-medium text-lg text-gray-900">
              Amount: {product.amount}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {isEditing ? (
            <Button
              onClick={onEditCancel}
              variant="secondary"
              size="sm"
              disabled={loading}
            >
              Cancel
            </Button>
          ) : (
            <Button
              onClick={onEditStart}
              variant="secondary"
              size="sm"
              disabled={loading}
            >
              Edit
            </Button>
          )}
          <Popconfirm
            title="Delete Product"
            description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
            onConfirm={handleDelete}
            okText="Delete"
            cancelText="Cancel"
            okType="danger"
          >
            <Button variant="danger" size="sm" disabled={loading}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
};
