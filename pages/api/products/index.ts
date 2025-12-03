import type { NextApiRequest, NextApiResponse } from "next";
import { validateSession } from "@/src/api/auth.api";
import { getProducts, createProduct } from "@/src/api/products.api";
import { ApiResponse, Product, ProductInput } from "@/src/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Product | Product[]>>
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

  if (req.method === "GET") {
    try {
      const products = await getProducts(user.id);
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch products" });
    }
    return;
  }

  if (req.method === "POST") {
    try {
      const input: ProductInput = req.body;
      const product = await createProduct(user.id, input);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create product";
      res.status(400).json({ success: false, error: message });
    }
    return;
  }

  res.status(405).json({ success: false, error: "Method not allowed" });
}
