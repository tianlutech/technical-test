import React, { useState, useRef } from "react";
import { Stack } from "@/src/layout/container.layout";
import { Product, ProductInput } from "@/src/types";
import ProductItem from "./product-item.component";

interface ProductListProps {
  products: Product[];
  onUpdate: (id: string, input: Partial<ProductInput>) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (orderedIds: string[]) => Promise<void>;
}

export default function ProductList({
  products,
  onUpdate,
  onDelete,
  onReorder,
}: ProductListProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [localOrder, setLocalOrder] = useState<Product[]>(products);
  const draggedOverId = useRef<string | null>(null);

  // Sync local order when products prop changes (e.g., after API response)
  React.useEffect(() => {
    setLocalOrder(products);
  }, [products]);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;
    if (draggedOverId.current === targetId) return;

    draggedOverId.current = targetId;

    const draggedIndex = localOrder.findIndex((p) => p.id === draggedId);
    const targetIndex = localOrder.findIndex((p) => p.id === targetId);

    if (draggedIndex === targetIndex) return;

    // Update local state only (visual feedback), no API call
    const newOrder = [...localOrder];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);
    setLocalOrder(newOrder);
  };

  const handleDragEnd = () => {
    // Only call API on drop if order actually changed
    const originalIds = products.map((p) => p.id).join(",");
    const newIds = localOrder.map((p) => p.id).join(",");

    if (originalIds !== newIds) {
      onReorder(localOrder.map((p) => p.id));
    }

    setDraggedId(null);
    draggedOverId.current = null;
  };

  return (
    <Stack gap="md">
      {localOrder.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isDragging={draggedId === product.id}
          onDragStart={() => handleDragStart(product.id)}
          onDragOver={(e) => handleDragOver(e, product.id)}
          onDragEnd={handleDragEnd}
        />
      ))}
    </Stack>
  );
}
