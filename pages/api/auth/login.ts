import type { NextApiRequest, NextApiResponse } from "next";
import { loginWithEmail } from "@/src/api/auth.api";
import { ApiResponse, LoginResponse } from "@/src/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LoginResponse>>
) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  const { email } = req.body;

  if (!email || typeof email !== "string") {
    res.status(400).json({ success: false, error: "Email is required" });
    return;
  }

  try {
    const result = await loginWithEmail(email);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    res.status(400).json({ success: false, error: message });
  }
}
