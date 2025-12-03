import { verifyToken } from './jwt';
import { NextApiRequest } from 'next';

export function getAuthUser(req: NextApiRequest) {
  const token = req.cookies['auth-token'] || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new Error('UNAUTHORIZED');
  }

  try {
    return verifyToken(token);
  } catch (error) {
    throw new Error('UNAUTHORIZED');
  }
}

