import { userRepository } from '@/src/repositories/user.repository';
import { generateToken } from '@/src/utils/jwt';
import { config } from '@/src/config/env';

export const authService = {
  async sendLoginEmail(email: string): Promise<{ loginUrl: string }> {
    let user = await userRepository.findByEmail(email);

    if (!user) {
      user = await userRepository.create(email);
    }

    const token = generateToken({ userId: user.id, email: user.email });
    const loginUrl = `${config.baseUrl}/auth/verify?token=${token}`;

    return { loginUrl };
  },

  async verifyToken(token: string) {
    const { verifyToken: verify } = await import('@/src/utils/jwt');
    return verify(token);
  },
};

