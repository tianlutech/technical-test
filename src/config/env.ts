export const config = {
  jwtSecret: (process.env.JWT_SECRET || 'your-secret-key-change-in-production') as string,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string,
  gmailUser: (process.env.GMAIL_USER || '') as string,
  gmailAppPassword: (process.env.GMAIL_APP_PASSWORD || '') as string,
  baseUrl: (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') as string,
};

