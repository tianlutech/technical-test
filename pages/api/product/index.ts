import { NextApiResponse } from 'next';
import { ProductService } from '../../../src/service/product.service';
import { withAuth, AuthenticatedRequest } from '../../../src/utils/jwt.util';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // GET /api/product → get all products for user
      const products = await ProductService.getUserProducts(req.user.userId);

      return res.status(200).json({
        success: true,
        products
      });

    } else if (req.method === 'POST') {
      // POST /api/product → create new product
      const { name, amount, comment } = req.body;

      // Validate required fields
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Product name is required' });
      }

      if (!amount || typeof amount !== 'number') {
        return res.status(400).json({ error: 'Amount is required and must be a number' });
      }

      // Create new product
      const product = await ProductService.createProduct({
        name,
        amount,
        comment,
        userId: req.user.userId
      });

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Product API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process product request'
    });
  }
}

export default withAuth(handler);
