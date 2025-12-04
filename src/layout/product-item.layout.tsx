import React from 'react';
import { Button } from './button.layout';
import { Input } from './input.layout';
import { Textarea } from './textarea.layout';

interface ProductItemProps {
  id: string;
  name: string;
  amount: number;
  comment: string | null;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: { name: string; amount: number; comment: string }) => void;
  onCancel: () => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  dragOver: boolean;
}

export const ProductItem: React.FC<ProductItemProps> = ({
  id,
  name: initialName,
  amount: initialAmount,
  comment: initialComment,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  dragOver,
}) => {
  const [name, setName] = React.useState(initialName);
  const [amount, setAmount] = React.useState(initialAmount.toString());
  const [comment, setComment] = React.useState(initialComment || '');

  React.useEffect(() => {
    if (isEditing) {
      setName(initialName);
      setAmount(initialAmount.toString());
      setComment(initialComment || '');
    }
  }, [isEditing, initialName, initialAmount, initialComment]);

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (!name.trim() || isNaN(numAmount) || numAmount <= 0) {
      return;
    }
    onSave({ name: name.trim(), amount: numAmount, comment: comment.trim() });
  };

  if (isEditing) {
    return (
      <div className="p-5 bg-amber-50/50">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
            />
            <Input
              label="Amount ($)"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <Textarea
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional notes..."
            rows={2}
          />
          <div className="flex gap-3">
            <Button onClick={handleSave} size="sm">
              Save Changes
            </Button>
            <Button onClick={onCancel} variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`group flex items-center gap-4 px-5 py-4 cursor-move transition-colors ${
        dragOver ? 'bg-amber-50' : 'hover:bg-neutral-50'
      }`}
    >
      {/* Drag Handle */}
      <div className="text-neutral-300 group-hover:text-neutral-400 transition-colors">
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="4" cy="4" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="4" cy="12" r="1.5" />
          <circle cx="10" cy="4" r="1.5" />
          <circle cx="10" cy="8" r="1.5" />
          <circle cx="10" cy="12" r="1.5" />
        </svg>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-neutral-900">{initialName}</h3>
        {initialComment && (
          <p className="text-sm text-neutral-500 mt-0.5 truncate">{initialComment}</p>
        )}
      </div>

      {/* Amount */}
      <div className="text-sm font-semibold text-neutral-900 tabular-nums">
        ${initialAmount.toFixed(2)}
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};
