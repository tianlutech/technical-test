import { NextApiRequest, NextApiResponse } from 'next';
import { productService } from '@/src/service/product.service';
import { getAuthUser } from '@/src/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = getAuthUser(req);

    if (req.method === 'GET') {
      const products = await productService.getProducts(user.userId);
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const { createProductValidator } = await import('@/src/validators/product.validator');
      const data = createProductValidator.parse(req.body);
      const product = await productService.createProduct(user.userId, data);
      return res.status(201).json(product);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message });
    }

    console.error('Products error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

