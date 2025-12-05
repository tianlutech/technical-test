import { NextApiRequest, NextApiResponse } from 'next';
import { authService } from '@/src/service/auth.service';
import { verifyTokenValidator } from '@/src/validators/auth.validator';
import { generateToken } from '@/src/utils/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const data = verifyTokenValidator.parse(req.body);
    const payload = await authService.verifyToken(data.token);

    const sessionToken = generateToken({ userId: payload.userId, email: payload.email });

    res.setHeader(
      'Set-Cookie',
      `auth-token=${sessionToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`
    );

    return res.status(200).json({ token: sessionToken });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message });
    }

    if (error.message === 'INVALID_TOKEN') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    console.error('Verify error:', error);
    return res.status(500).json({ message: 'Failed to verify token' });
  }
}

