"use client";

import { useState } from "react";
import Card from "@/layout/card.layout";
import Input from "@/layout/input.layout";
import Button from "@/layout/button.layout";

interface AddProductFormProps {
  onAdd: (data: { name: string; amount: number; comment?: string }) => Promise<void>;
}

export default function AddProductForm({ onAdd }: AddProductFormProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Product name is required");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      await onAdd({
        name: name.trim(),
        amount: amountNum,
        comment: comment.trim() || undefined,
      });
      setName("");
      setAmount("");
      setComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Laptop"
            disabled={loading}
          />
          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            disabled={loading}
          />
        </div>
        <Input
          label="Comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Additional notes..."
          disabled={loading}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} fullWidth>
          {loading ? "Adding..." : "Add Product"}
        </Button>
      </form>
    </Card>
  );
}
