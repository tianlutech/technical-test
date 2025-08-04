// components/add-product-modal.component.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { CreateProductData } from '../../types/product.types';

interface AddProductModalProps {
  onAdd: (productData: CreateProductData) => Promise<void>;
  onClose: () => void;
  initialValues?: CreateProductData;
  submitLabel?: string;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  onAdd,
  onClose,
  initialValues,
  submitLabel = 'Add Product'
}) => {
  const [formData, setFormData] = useState<CreateProductData>(
    initialValues || { name: '', amount: 0, comment: '' }
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateProductData>>({});

  useEffect(() => {
    if (initialValues) setFormData(initialValues);
  }, [initialValues]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateProductData> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await onAdd({
        name: formData.name.trim(),
        amount: formData.amount,
        comment: formData.comment?.trim() || ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateProductData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <Modal
      open={true}
      title={submitLabel === 'Add Product' ? 'Add New Product' : 'Edit Product'}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>Cancel</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
          {submitLabel}
        </Button>
      ]}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <Input
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder="Enter product name"
            disabled={loading}
            status={errors.name ? 'error' : ''}
          />
          {errors.name && <div style={{ color: 'red', fontSize: 12 }}>{errors.name}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
          <Input
            type="number"
            min={1}
            value={formData.amount}
            onChange={e => handleInputChange('amount', parseInt(e.target.value) || 0)}
            placeholder="Enter amount"
            disabled={loading}
            status={errors.amount ? 'error' : ''}
          />
          {errors.amount && <div style={{ color: 'red', fontSize: 12 }}>{errors.amount}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
          <Input.TextArea
            value={formData.comment}
            onChange={e => handleInputChange('comment', e.target.value)}
            placeholder="Enter product comment"
            rows={3}
            disabled={loading}
            status={errors.comment ? 'error' : ''}
          />
          {errors.comment && <div style={{ color: 'red', fontSize: 12 }}>{errors.comment}</div>}
        </div>
      </form>
    </Modal>
  );
};
