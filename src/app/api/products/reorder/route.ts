import { NextRequest, NextResponse } from 'next/server';
import { ProductsService } from '../../../../service/products.service';
import { AuthService } from '../../../../firebase/auth.service';

export async function POST(request: NextRequest) {
  try {
    // Get user from Firebase auth
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productIds } = body;

    if (!Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'Product IDs array is required' },
        { status: 400 }
      );
    }

    await ProductsService.reorderProducts(currentUser.uid, productIds);
    return NextResponse.json({ message: 'Products reordered successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to reorder products';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
