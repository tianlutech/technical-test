import type { NextApiRequest, NextApiResponse } from "next";
import { validateSession } from "@/src/api/auth.api";
import { reorderProducts } from "@/src/api/products.api";
import { ApiResponse, Product, ReorderInput } from "@/src/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Product[]>>
) {
  if (req.method !== "PUT") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

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

  try {
    const input: ReorderInput = req.body;
    const products = await reorderProducts(user.id, input);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to reorder products";
    res.status(400).json({ success: false, error: message });
  }
}
