import type { NextApiRequest, NextApiResponse } from "next";
import { validateSession } from "@/src/api/auth.api";
import {
  getProduct,
  updateProduct,
  deleteProduct,
} from "@/src/api/products.api";
import { ApiResponse, Product, ProductInput } from "@/src/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Product | null>>
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ success: false, error: "Authentication required" });
    return;
  }

  const user = await validateSession(token);

  if (!user) {
    res
      .status(401)
      .json({ success: false, error: "Invalid or expired session" });
    return;
  }

  const { id } = req.query;

  if (typeof id !== "string") {
    res.status(400).json({ success: false, error: "Invalid product ID" });
    return;
  }

  if (req.method === "GET") {
    try {
      const product = await getProduct(id, user.id);

      if (!product) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }

      res.status(200).json({ success: true, data: product });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch product" });
    }
    return;
  }

  if (req.method === "PUT") {
    try {
      const input: Partial<ProductInput> = req.body;
      const product = await updateProduct(id, user.id, input);

      if (!product) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }

      res.status(200).json({ success: true, data: product });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update product";
      res.status(400).json({ success: false, error: message });
    }
    return;
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await deleteProduct(id, user.id);

      if (!deleted) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }

      res.status(200).json({ success: true, data: null });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to delete product" });
    }
    return;
  }

  res.status(405).json({ success: false, error: "Method not allowed" });
}
