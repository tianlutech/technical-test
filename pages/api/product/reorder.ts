import { NextApiResponse } from 'next';
import { ProductService } from '../../../src/service/product.service';
import { withAuth, AuthenticatedRequest } from '../../../src/utils/jwt.util';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: 'Products array is required' });
    }

    // Validate each product item and collect order values
    const orderValues = new Set();
    for (const item of products) {
      if (!item.id || typeof item.id !== 'string') {
        return res.status(400).json({ error: 'Each product must have a valid id' });
      }
      if (typeof item.order !== 'number') {
        return res.status(400).json({ error: 'Each product must have a valid order number' });
      }
      
      // Check for duplicate order values
      if (orderValues.has(item.order)) {
        return res.status(400).json({ error: 'Order values must be unique - no duplicates allowed' });
      }
      orderValues.add(item.order);
    }

    // Normalize order values to be consecutive starting from 1
    // Sort products by their intended order, then assign 1, 2, 3, etc.
    const sortedProducts = [...products].sort((a, b) => a.order - b.order);
    const normalizedProducts = sortedProducts.map((product, index) => ({
      id: product.id,
      order: index + 1
    }));

    // Reorder products using service with normalized order values
    const updatedProducts = await ProductService.reorderProducts(req.user.userId, normalizedProducts);

    return res.status(200).json({
      success: true,
      message: 'Products reordered successfully',
      products: updatedProducts
    });

  } catch (error) {
    console.error('Product reorder API error:', error);
    
    // Handle service-specific errors
    if (error instanceof Error && error.message === 'One or more products do not belong to the user') {
      return res.status(403).json({ error: error.message });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process reorder request'
    });
  }
}

export default withAuth(handler);
