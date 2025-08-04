// Configuration files
export const config = {
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: '6h' as const
  },
  database: {
    url: process.env.DATABASE_URL as string
  }
};
