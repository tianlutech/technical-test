import { NextApiRequest, NextApiResponse } from 'next';
import { productService } from '@/src/service/product.service';
import { reorderProductsValidator } from '@/src/validators/product.validator';
import { getAuthUser } from '@/src/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = getAuthUser(req);
    const data = reorderProductsValidator.parse(req.body);
    await productService.reorderProducts(user.userId, data);
    return res.status(204).end();
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (error.message === 'INVALID_REORDER') {
      return res.status(400).json({ message: 'Invalid reorder data' });
    }

    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message });
    }

    console.error('Reorder error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

