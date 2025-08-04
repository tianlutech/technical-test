import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { config } from '../config/app.config';

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends NextApiRequest {
  user: JwtPayload;
}

/**
 * Middleware to validate JWT token and extract user information
 * Returns the decoded user payload or sends error response
 */
export function validateAuth(req: NextApiRequest, res: NextApiResponse): JwtPayload | null {
  // Validate Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization token required' });
    return null;
  }

  const token = authHeader.substring(7);

  // Verify JWT token
  try {
    const decoded = jwt.verify(token, config.jwt.secret as string) as JwtPayload;
    return decoded;
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }
}

/**
 * Higher-order function that wraps API handlers with authentication
 */
export function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = validateAuth(req, res);
    if (!user) {
      return;
    }
    // Add user to request object
    (req as AuthenticatedRequest).user = user;
    // Call the handler
    return handler(req as AuthenticatedRequest, res);
  };
}
