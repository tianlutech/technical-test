import { auth } from "@/config/auth";
import { productService } from "@/service/product.service";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { name, amount, comment } = body;

  if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
    return NextResponse.json(
      { error: "Product name cannot be empty" },
      { status: 400 }
    );
  }

  if (amount !== undefined && (typeof amount !== "number" || amount < 0)) {
    return NextResponse.json(
      { error: "Amount must be a positive number" },
      { status: 400 }
    );
  }

  const updateData: any = {};
  if (name !== undefined) updateData.name = name.trim();
  if (amount !== undefined) updateData.amount = amount;
  if (comment !== undefined) updateData.comment = comment?.trim();

  const product = await productService.updateProduct(
    id,
    session.user.id!,
    updateData
  );

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const product = await productService.deleteProduct(
    id,
    session.user.id!
  );

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
