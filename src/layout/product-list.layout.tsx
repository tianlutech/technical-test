import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Product } from '../frontend-service/api-client';
import { Button } from './button.layout';

interface ProductItemProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

function SortableProductItem({ product, onEdit, onDelete }: ProductItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-6 border-b border-gray-200 ${isDragging ? 'bg-gray-50' : 'bg-white'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-4">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1"
            title="Drag to reorder"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
            </svg>
          </div>
          
          {/* Product Content */}
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
        
        {/* Action Buttons */}
        {(onEdit || onDelete) && (
          <div className="ml-4 flex gap-2">
            {onEdit && (
              <Button
                onClick={() => onEdit(product)}
                variant="secondary"
                size="sm"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={() => onDelete(product)}
                variant="secondary"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onReorder?: (products: Product[]) => void;
}

export function ProductList({ products, loading, onEdit, onDelete, onReorder }: ProductListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sort products by order for consistent display
  const sortedProducts = [...products].sort((a, b) => a.order - b.order);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortedProducts.findIndex((product) => product.id === active.id);
      const newIndex = sortedProducts.findIndex((product) => product.id === over?.id);

      const reorderedProducts = arrayMove(sortedProducts, oldIndex, newIndex);
      
      if (onReorder) {
        onReorder(reorderedProducts);
      }
    }
  };

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
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortedProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
          {sortedProducts.map((product) => (
            <SortableProductItem
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}