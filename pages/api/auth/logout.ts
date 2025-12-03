import type { NextApiRequest, NextApiResponse } from "next";
import { logout, validateSession } from "@/src/api/auth.api";
import { ApiResponse } from "@/src/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ success: false, error: "Not authenticated" });
    return;
  }

  try {
    await logout(token);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Logout failed" });
  }
}
