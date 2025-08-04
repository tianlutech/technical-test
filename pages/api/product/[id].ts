import { NextApiResponse } from 'next';
import { ProductService } from '../../../src/service/product.service';
import { withAuth, AuthenticatedRequest } from '../../../src/utils/jwt.util';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    // Get product ID from URL
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists and belongs to the user
    const existingProduct = await ProductService.findUserProduct(id, req.user.userId);

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found or access denied' });
    }

    if (req.method === 'PUT') {
      // PUT /api/product/[id] → edit product
      const { name, amount, comment } = req.body;

      // Validate required fields
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Product name is required' });
      }

      if (!amount || typeof amount !== 'number') {
        return res.status(400).json({ error: 'Amount is required and must be a number' });
      }

      // Update product
      const updatedProduct = await ProductService.updateProduct(id, {
        name,
        amount,
        comment
      });

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product: updatedProduct
      });

    } else if (req.method === 'DELETE') {
      // DELETE /api/product/[id] → delete product
      await ProductService.deleteProduct(id);

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
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
