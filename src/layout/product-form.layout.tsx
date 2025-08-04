import React, { useState, useEffect } from 'react';
import { Button } from './button.layout';
import { Input } from './input.layout';
import { CreateProductRequest, Product } from '../frontend-service/api-client';

interface ProductFormProps {
  onSubmit: (productData: CreateProductRequest) => Promise<void>;
  loading?: boolean;
  onCancel?: () => void;
  editProduct?: Product | null;
}

interface FormErrors {
  name?: string;
  amount?: string;
  comment?: string;
}

export function ProductForm({ onSubmit, loading, onCancel, editProduct }: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    amount: 0,
    comment: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Populate form when editing
  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name,
        amount: editProduct.amount,
        comment: editProduct.comment || '',
      });
    } else {
      setFormData({
        name: '',
        amount: 0,
        comment: '',
      });
    }
    setErrors({});
  }, [editProduct]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        comment: formData.comment?.trim() || undefined,
      };
      await onSubmit(submitData);
      
      // Reset form on success only if not editing
      if (!editProduct) {
        setFormData({ name: '', amount: 0, comment: '' });
        setErrors({});
      }
    } catch (error) {
      // Error handling is done by parent component
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: keyof CreateProductRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {editProduct ? 'Edit Product' : 'Add New Product'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Product Name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="Enter product name"
            disabled={loading}
            required
          />
        </div>

        <div>
          <Input
            label="Amount ($)"
            type="number"
            value={formData.amount.toString()}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            error={errors.amount}
            placeholder="0.00"
            step="0.01"
            min="0"
            disabled={loading}
            required
          />
        </div>

        <div>
          <Input
            label="Comment (Optional)"
            type="text"
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            placeholder="Add a comment about this product"
            disabled={loading}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? (editProduct ? 'Updating...' : 'Adding...') : (editProduct ? 'Update Product' : 'Add Product')}
          </Button>
          
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
