import React from 'react';
import { Button } from './button.layout';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'danger'
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {message}
          </p>
          
          <div className="flex gap-3 justify-end">
            <Button
              onClick={onCancel}
              variant="secondary"
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              variant={variant === 'danger' ? 'primary' : 'secondary'}
              disabled={loading}
              className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : ''}
            >
              {loading ? 'Processing...' : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
