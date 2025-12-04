import { auth } from "@/config/auth";
import { productService } from "@/service/product.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await productService.getUserProducts(session.user.id!);
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, amount, comment } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json(
      { error: "Product name is required" },
      { status: 400 }
    );
  }

  if (typeof amount !== "number" || amount < 0) {
    return NextResponse.json(
      { error: "Amount must be a positive number" },
      { status: 400 }
    );
  }

  const product = await productService.createProduct({
    name: name.trim(),
    amount,
    comment: comment?.trim(),
    userId: session.user.id!,
  });

  return NextResponse.json(product, { status: 201 });
}
