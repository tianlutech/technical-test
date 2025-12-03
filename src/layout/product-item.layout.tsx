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
      <div
        className={`p-5 border-2 border-orange-300 rounded-xl bg-orange-50/50 shadow-sm ${
          dragOver ? 'border-orange-400' : ''
        }`}
      >
        <div className="space-y-4">
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
          <Textarea
            label="Comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
          />
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} size="sm" className="bg-orange-500 hover:bg-orange-600 focus:ring-orange-500">
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
      className={`group p-5 border border-slate-200 rounded-xl bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-move ${
        dragOver ? 'border-orange-400 shadow-lg scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <div className="flex-shrink-0 text-slate-300 group-hover:text-slate-400 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-base font-semibold text-slate-800 truncate">{initialName}</h3>
          </div>
          {initialComment && (
            <p className="text-sm text-slate-500 truncate">{initialComment}</p>
          )}
        </div>

        {/* Amount */}
        <div className="flex-shrink-0 text-right">
          <p className="text-xl font-bold text-slate-800">${initialAmount.toFixed(2)}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

