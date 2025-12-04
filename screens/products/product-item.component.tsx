"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Input from "@/layout/input.layout";
import IconButton from "@/layout/icon-button.layout";
import { Product } from "@/service/product.api";

interface ProductItemProps {
  product: Product;
  onUpdate: (id: string, data: { name?: string; amount?: number; comment?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function ProductItem({ product, onUpdate, onDelete }: ProductItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [amount, setAmount] = useState(product.amount.toString());
  const [comment, setComment] = useState(product.comment || "");
  const [loading, setLoading] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id, disabled: isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0) return;

    setLoading(true);
    try {
      await onUpdate(product.id, {
        name: name.trim(),
        amount: amountNum,
        comment: comment.trim() || undefined,
      });
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(product.name);
    setAmount(product.amount.toString());
    setComment(product.comment || "");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      setLoading(true);
      await onDelete(product.id);
    }
  };

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
          />
        </div>
        <Input
          label="Comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading}
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-gray-300 transition-colors"
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="flex items-baseline gap-3">
            <p className="font-medium text-gray-900">{product.name}</p>
            <p className="text-lg text-blue-600 font-semibold">${product.amount.toFixed(2)}</p>
          </div>
          {product.comment && (
            <p className="text-sm text-gray-600 mt-1">{product.comment}</p>
          )}
        </div>
      </div>
      <div className="flex gap-1">
        <IconButton
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          }
          onClick={() => setIsEditing(true)}
          disabled={loading}
        />
        <IconButton
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          }
          variant="danger"
          onClick={handleDelete}
          disabled={loading}
        />
      </div>
    </div>
  );
}
