import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/src/utils/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.cookies['auth-token'] || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = verifyToken(token);

    return res.status(200).json({ userId: payload.userId, email: payload.email });
  } catch (error: any) {
    if (error.message === 'INVALID_TOKEN') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    console.error('Me error:', error);
    return res.status(500).json({ message: 'Failed to verify authentication' });
  }
}

