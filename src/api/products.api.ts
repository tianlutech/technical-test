import prisma from "@/src/config/database.config";
import { Product, ProductInput, ReorderInput } from "@/src/types";

function toProduct(dbProduct: {
  id: string;
  name: string;
  amount: number;
  comment: string | null;
  order: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    amount: dbProduct.amount,
    comment: dbProduct.comment,
    order: dbProduct.order,
    userId: dbProduct.userId,
    createdAt: dbProduct.createdAt.toISOString(),
    updatedAt: dbProduct.updatedAt.toISOString(),
  };
}

export async function getProducts(userId: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  });

  return products.map(toProduct);
}

export async function getProduct(
  id: string,
  userId: string
): Promise<Product | null> {
  const product = await prisma.product.findFirst({
    where: { id, userId },
  });

  if (!product) {
    return null;
  }

  return toProduct(product);
}

export async function createProduct(
  userId: string,
  input: ProductInput
): Promise<Product> {
  if (!input.name || input.name.trim() === "") {
    throw new Error("Product name is required");
  }

  if (typeof input.amount !== "number" || isNaN(input.amount)) {
    throw new Error("Valid amount is required");
  }

  const maxOrderProduct = await prisma.product.findFirst({
    where: { userId },
    orderBy: { order: "desc" },
  });

  const nextOrder = maxOrderProduct ? maxOrderProduct.order + 1 : 0;

  const product = await prisma.product.create({
    data: {
      name: input.name.trim(),
      amount: input.amount,
      comment: input.comment?.trim() || null,
      order: nextOrder,
      userId,
    },
  });

  return toProduct(product);
}

export async function updateProduct(
  id: string,
  userId: string,
  input: Partial<ProductInput>
): Promise<Product | null> {
  const existing = await prisma.product.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return null;
  }

  const updateData: {
    name?: string;
    amount?: number;
    comment?: string | null;
  } = {};

  if (input.name !== undefined) {
    if (input.name.trim() === "") {
      throw new Error("Product name cannot be empty");
    }
    updateData.name = input.name.trim();
  }

  if (input.amount !== undefined) {
    if (typeof input.amount !== "number" || isNaN(input.amount)) {
      throw new Error("Valid amount is required");
    }
    updateData.amount = input.amount;
  }

  if (input.comment !== undefined) {
    updateData.comment = input.comment?.trim() || null;
  }

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
  });

  return toProduct(product);
}

export async function deleteProduct(
  id: string,
  userId: string
): Promise<boolean> {
  const existing = await prisma.product.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return false;
  }

  await prisma.product.delete({ where: { id } });
  return true;
}

export async function reorderProducts(
  userId: string,
  input: ReorderInput
): Promise<Product[]> {
  if (!input.orderedIds || !Array.isArray(input.orderedIds)) {
    throw new Error("Invalid order data");
  }

  const products = await prisma.product.findMany({
    where: { userId },
  });

  const productIds = products.map((p: { id: string }) => p.id);
  const validIds = input.orderedIds.every((id) => productIds.includes(id));

  if (!validIds || input.orderedIds.length !== productIds.length) {
    throw new Error("Invalid product IDs in order");
  }

  await prisma.$transaction(
    input.orderedIds.map((id, index) =>
      prisma.product.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  return getProducts(userId);
}
