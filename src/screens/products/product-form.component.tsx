import React, { useState } from "react";
import { Card } from "@/src/layout/card.layout";
import { Input, TextArea } from "@/src/layout/input.layout";
import { Button } from "@/src/layout/button.layout";
import { Flex, Spacer } from "@/src/layout/container.layout";
import { Text } from "@/src/layout/text.layout";
import { ProductInput } from "@/src/types";

interface ProductFormProps {
  onSubmit: (input: ProductInput) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ProductInput>;
}

export default function ProductForm({
  onSubmit,
  onCancel,
  initialData,
}: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "");
  const [comment, setComment] = useState(initialData?.comment || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; amount?: string }>({});

  const validate = (): boolean => {
    const newErrors: { name?: string; amount?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(parseFloat(amount))) {
      newErrors.amount = "Amount must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    await onSubmit({
      name: name.trim(),
      amount: parseFloat(amount),
      comment: comment.trim() || undefined,
    });

    setLoading(false);
  };

  return (
    <Card>
      <Text variant="h3" color="accent">
        Add New Product
      </Text>
      <Spacer size="md" />
      <form onSubmit={handleSubmit}>
        <Input
          label="Product Name"
          value={name}
          onChange={(v) => {
            setName(v);
            setErrors((e) => ({ ...e, name: undefined }));
          }}
          placeholder="e.g. MacBook Pro 16"
          error={errors.name}
          autoFocus
        />
        <Spacer size="md" />
        <Input
          label="Amount (USD)"
          type="number"
          value={amount}
          onChange={(v) => {
            setAmount(v);
            setErrors((e) => ({ ...e, amount: undefined }));
          }}
          placeholder="e.g. 2499.99"
          error={errors.amount}
        />
        <Spacer size="md" />
        <TextArea
          label="Comment (optional)"
          value={comment}
          onChange={setComment}
          placeholder="e.g. Space Gray, 32GB RAM, 1TB SSD"
          rows={2}
        />
        <Spacer size="lg" />
        <Flex justify="end" gap="md">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add Product
          </Button>
        </Flex>
      </form>
    </Card>
  );
}
