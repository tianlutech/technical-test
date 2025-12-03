import { NextApiRequest, NextApiResponse } from "next";
import { validateSession } from "@/src/api/auth.api";
import { User, ApiResponse } from "@/src/types";

export type AuthenticatedRequest = NextApiRequest & {
  user: User;
};

type ApiHandler<T> = (
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<T>>
) => Promise<void>;

export function withAuth<T>(handler: ApiHandler<T>) {
  return async (req: NextApiRequest, res: NextApiResponse<ApiResponse<T>>) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      res
        .status(401)
        .json({ success: false, error: "Authentication required" });
      return;
    }

    const user = await validateSession(token);

    if (!user) {
      res
        .status(401)
        .json({ success: false, error: "Invalid or expired session" });
      return;
    }

    (req as AuthenticatedRequest).user = user;
    await handler(req as AuthenticatedRequest, res);
  };
}

export function apiHandler<T>(
  handlers: {
    GET?: ApiHandler<T>;
    POST?: ApiHandler<T>;
    PUT?: ApiHandler<T>;
    DELETE?: ApiHandler<T>;
  },
  requireAuth = true
) {
  return async (req: NextApiRequest, res: NextApiResponse<ApiResponse<T>>) => {
    const method = req.method as keyof typeof handlers;
    const handler = handlers[method];

    if (!handler) {
      res.status(405).json({ success: false, error: "Method not allowed" });
      return;
    }

    if (requireAuth) {
      await withAuth(handler)(req, res);
    } else {
      await handler(req as AuthenticatedRequest, res);
    }
  };
}
