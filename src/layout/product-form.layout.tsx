import React from 'react';
import { Button } from './button.layout';
import { Input } from './input.layout';
import { Textarea } from './textarea.layout';

interface ProductFormData {
  name: string;
  amount: string;
  comment: string;
}

interface ProductFormProps {
  data: ProductFormData;
  onChange: (data: ProductFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ data, onChange, onSubmit, onCancel }) => {
  return (
    <div className="mb-8 border border-neutral-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-medium text-neutral-900">New Product</h3>
        <button onClick={onCancel} className="text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Product Name"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            placeholder="Enter product name"
            required
          />
          <Input
            label="Amount ($)"
            type="number"
            step="0.01"
            value={data.amount}
            onChange={(e) => onChange({ ...data, amount: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
        <Textarea
          label="Comment (optional)"
          value={data.comment}
          onChange={(e) => onChange({ ...data, comment: e.target.value })}
          placeholder="Add any notes about this product..."
          rows={2}
        />
        <div className="flex gap-3 pt-2">
          <Button type="submit">Add Product</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

