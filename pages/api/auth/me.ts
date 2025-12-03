import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUser } from "@/src/api/auth.api";
import { ApiResponse, User } from "@/src/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User>>
) {
  if (req.method !== "GET") {
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
    const user = await getCurrentUser(token);

    if (!user) {
      res
        .status(401)
        .json({ success: false, error: "Invalid or expired session" });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to get user" });
  }
}
