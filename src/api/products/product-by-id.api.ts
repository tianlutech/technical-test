import { NextApiRequest, NextApiResponse } from 'next';
import { productService } from '@/src/service/product.service';
import { getAuthUser } from '@/src/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
    return res.status(200).end();
  }

  try {
    const user = getAuthUser(req);
    const { id } = req.query;

    if (typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    if (req.method === 'GET') {
      const product = await productService.getProduct(id, user.userId);
      return res.status(200).json(product);
    }

    if (req.method === 'PUT') {
      const { updateProductValidator } = await import('@/src/validators/product.validator');
      const data = updateProductValidator.parse(req.body);
      const product = await productService.updateProduct(id, user.userId, data);
      return res.status(200).json(product);
    }

    if (req.method === 'DELETE') {
      await productService.deleteProduct(id, user.userId);
      return res.status(204).end();
    }

    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (error.message === 'PRODUCT_NOT_FOUND') {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message });
    }

    console.error('Product error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

