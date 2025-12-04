const API_BASE = "/api/products";

export interface Product {
  id: string;
  name: string;
  amount: number;
  comment?: string | null;
  order: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  amount: number;
  comment?: string;
}

export interface UpdateProductInput {
  name?: string;
  amount?: number;
  comment?: string;
}

export const productApi = {
  async getAll(): Promise<Product[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  },

  async create(data: CreateProductInput): Promise<Product> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create product");
    }
    return response.json();
  },

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update product");
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete product");
    }
  },

  async reorder(productIds: string[]): Promise<Product[]> {
    const response = await fetch(`${API_BASE}/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to reorder products");
    }
    return response.json();
  },
};
