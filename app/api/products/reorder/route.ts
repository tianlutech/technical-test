import { auth } from "@/config/auth";
import { productService } from "@/service/product.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { productIds } = body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return NextResponse.json(
      { error: "Invalid product IDs array" },
      { status: 400 }
    );
  }

  const products = await productService.reorderProducts(
    session.user.id!,
    productIds
  );

  if (!products) {
    return NextResponse.json(
      { error: "Some products not found or unauthorized" },
      { status: 404 }
    );
  }

  return NextResponse.json(products);
}
