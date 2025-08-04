import { NextRequest, NextResponse } from 'next/server';
import { ProductsService } from '../../../../service/products.service';
import { UpdateProductData } from '../../../../types/product.types';
import { AuthService } from '../../../../firebase/auth.service';

export async function GET(request: NextRequest) {
  try {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = request.nextUrl.pathname.split('/').pop(); // or use regex to extract
    if (!id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    const product = await ProductsService.getProduct(id, currentUser.uid);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    const body = await request.json();
    const productData: UpdateProductData = {
      name: body.name,
      amount: body.amount,
      comment: body.comment,
    };

    const product = await ProductsService.updateProduct(id, currentUser.uid, productData);
    return NextResponse.json({ product });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    await ProductsService.deleteProduct(id, currentUser.uid);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

