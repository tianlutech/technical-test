import React, { useState } from "react";
import { Card, DraggableCard } from "@/src/layout/card.layout";
import { Text } from "@/src/layout/text.layout";
import { Input, TextArea } from "@/src/layout/input.layout";
import { IconButton } from "@/src/layout/icon-button.layout";
import { Flex, Stack, Spacer } from "@/src/layout/container.layout";
import { Product, ProductInput } from "@/src/types";

interface ProductItemProps {
  product: Product;
  onUpdate: (id: string, input: Partial<ProductInput>) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
  isDragging: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

export default function ProductItem({
  product,
  onUpdate,
  onDelete,
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
}: ProductItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = async (input: Partial<ProductInput>) => {
    const success = await onUpdate(product.id, input);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = () => onDelete(product.id);

  if (isEditing) {
    return (
      <ProductItemEdit
        product={product}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ProductItemView
      product={product}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isDragging={isDragging}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    />
  );
}

interface ProductItemViewProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  isDragging: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

function ProductItemView({
  product,
  onEdit,
  onDelete,
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
}: ProductItemViewProps) {
  return (
    <DraggableCard
      isDragging={isDragging}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <Flex justify="between" align="start">
        <Flex gap="md" align="start">
          <IconButton icon="drag" onClick={() => {}} title="Drag to reorder" />
          <Flex direction="col" align="start" gap="none">
            <Text variant="h3" color="primary">
              {product.name}
            </Text>
            <Spacer size="sm" />
            <Flex gap="sm" align="center">
              <Text variant="caption" color="accent">
                ${product.amount.toLocaleString()}
              </Text>
            </Flex>
            {product.comment && (
              <>
                <Spacer size="sm" />
                <Text variant="caption" color="muted">
                  {product.comment}
                </Text>
              </>
            )}
          </Flex>
        </Flex>
        <Flex gap="sm">
          <IconButton icon="edit" onClick={onEdit} title="Edit" />
          <IconButton
            icon="delete"
            onClick={onDelete}
            variant="danger"
            title="Delete"
          />
        </Flex>
      </Flex>
    </DraggableCard>
  );
}

interface ProductItemEditProps {
  product: Product;
  onSave: (input: Partial<ProductInput>) => Promise<void>;
  onCancel: () => void;
}

function ProductItemEdit({ product, onSave, onCancel }: ProductItemEditProps) {
  const [name, setName] = useState(product.name);
  const [amount, setAmount] = useState(product.amount.toString());
  const [comment, setComment] = useState(product.comment || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onSave({
      name: name.trim(),
      amount: parseFloat(amount),
      comment: comment.trim() || undefined,
    });
    setLoading(false);
  };

  // Handle keyboard shortcuts for saving and canceling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <Card padding="md">
      <Stack gap="md">
        <Input
          value={name}
          onChange={setName}
          placeholder="e.g. MacBook Pro 16"
          autoFocus
          onKeyDown={handleKeyDown}
        />
        <Input
          type="number"
          value={amount}
          onChange={setAmount}
          placeholder="e.g. 2499.99 (USD)"
          onKeyDown={handleKeyDown}
        />
        <TextArea
          value={comment}
          onChange={setComment}
          placeholder="e.g. Space Gray, 32GB RAM, 1TB SSD"
          rows={2}
        />
        <Flex justify="end" gap="sm">
          <IconButton
            icon="x"
            onClick={onCancel}
            title="Cancel"
            disabled={loading}
          />
          <IconButton
            icon="check"
            onClick={handleSave}
            variant="success"
            title="Save"
            disabled={loading}
          />
        </Flex>
      </Stack>
    </Card>
  );
}
