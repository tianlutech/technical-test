"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Container from "@/layout/container.layout";
import Button from "@/layout/button.layout";
import { productApi, Product } from "@/service/product.api";
import AddProductForm from "./add-product-form.component";
import ProductItem from "./product-item.component";
import { logout } from "@/app/api/auth/actions";

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      loadProducts();
    }
  }, [status, router]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAll();
      setProducts(data);
      setError("");
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (data: { name: string; amount: number; comment?: string }) => {
    const product = await productApi.create(data);
    setProducts([...products, product]);
  };

  const handleUpdateProduct = async (
    id: string,
    data: { name?: string; amount?: number; comment?: string }
  ) => {
    const updated = await productApi.update(id, data);
    setProducts(products.map((p) => (p.id === id ? updated : p)));
  };

  const handleDeleteProduct = async (id: string) => {
    await productApi.delete(id);
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);

      const newProducts = arrayMove(products, oldIndex, newIndex);
      setProducts(newProducts);

      try {
        await productApi.reorder(newProducts.map((p) => p.id));
      } catch (err) {
        setError("Failed to save new order");
        setProducts(products);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Container>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
            <p className="text-gray-600 mt-1">{session?.user?.email}</p>
          </div>
          <Button onClick={handleLogout} variant="secondary">
            Logout
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <AddProductForm onAdd={handleAddProduct} />

          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No products yet. Add your first product above!</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={products.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {products.map((product) => (
                    <ProductItem
                      key={product.id}
                      product={product}
                      onUpdate={handleUpdateProduct}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
