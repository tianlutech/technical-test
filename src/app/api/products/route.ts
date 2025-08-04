import { NextRequest, NextResponse } from 'next/server';
import { ProductsService } from '../../../service/products.service';
import { CreateProductData } from '../../../types/product.types';
import { AuthService } from '../../../firebase/auth.service';

export async function GET() {
  try {
    // Get user from Firebase auth
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await ProductsService.getUserProducts(currentUser.uid);
    return NextResponse.json({ products });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user from Firebase auth
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const productData: CreateProductData = {
      name: body.name,
      amount: body.amount,
      comment: body.comment || '',
    };

    const product = await ProductsService.createProduct(currentUser.uid, productData);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
