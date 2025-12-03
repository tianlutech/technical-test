import { z } from 'zod';

export const loginValidator = z.object({
  email: z.string().email('Invalid email address'),
});

export type LoginDto = z.infer<typeof loginValidator>;

export const verifyTokenValidator = z.object({
  token: z.string().min(1, 'Token is required'),
});

export type VerifyTokenDto = z.infer<typeof verifyTokenValidator>;

