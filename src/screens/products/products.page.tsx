import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  PageLayout,
  MainContent,
  Flex,
  Section,
} from "@/src/layout/container.layout";
import { Text } from "@/src/layout/text.layout";
import { Button } from "@/src/layout/button.layout";
import { Loader, EmptyState } from "@/src/layout/loader.layout";
import { useToast } from "@/src/layout/toast.layout";
import { useAuth } from "@/src/context/auth.context";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  reorderProducts,
} from "@/src/service/products.service";
import { Product, ProductInput } from "@/src/types";
import ProductsHeader from "./products-header.component";
import ProductForm from "./product-form.component";
import ProductList from "./product-list.component";

export default function ProductsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
      return;
    }

    if (isAuthenticated) {
      loadProducts();
    }
  }, [authLoading, isAuthenticated]);

  const loadProducts = async () => {
    const result = await getProducts();

    if (result.success && result.data) {
      setProducts(result.data);
    }

    setLoading(false);
  };

  const handleAddProduct = async (input: ProductInput) => {
    const result = await createProduct(input);

    if (result.success && result.data) {
      setProducts((prev) => [...prev, result.data!]);
      setShowForm(false);
      showToast("Product added", "success");
    } else {
      showToast(result.error || "Failed to add product", "error");
    }
  };

  const handleUpdateProduct = async (
    id: string,
    input: Partial<ProductInput>
  ) => {
    const result = await updateProduct(id, input);

    if (result.success && result.data) {
      setProducts((prev) => prev.map((p) => (p.id === id ? result.data! : p)));
      showToast("Product updated", "success");
      return true;
    } else {
      showToast(result.error || "Failed to update product", "error");
      return false;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const result = await deleteProduct(id);

    if (result.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Product deleted", "success");
    } else {
      showToast(result.error || "Failed to delete product", "error");
    }
  };

  const handleReorder = async (orderedIds: string[]) => {
    const result = await reorderProducts({ orderedIds });

    if (result.success && result.data) {
      setProducts(result.data);
    } else {
      showToast(result.error || "Failed to reorder", "error");
    }
  };

  if (authLoading || loading) {
    return (
      <PageLayout>
        <Loader fullScreen />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ProductsHeader />
      <MainContent>
        <Flex justify="between" align="center">
          <Text variant="h2" color="accent">
            Products ({products.length})
          </Text>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>Add Product</Button>
          )}
        </Flex>

        {showForm && (
          <Section>
            <ProductForm
              onSubmit={handleAddProduct}
              onCancel={() => setShowForm(false)}
            />
          </Section>
        )}

        <Section>
          {products.length === 0 ? (
            <EmptyState
              title="No products yet"
              description="Add your first product to get started"
              action={
                !showForm && (
                  <Button onClick={() => setShowForm(true)}>Add Product</Button>
                )
              }
            />
          ) : (
            <ProductList
              products={products}
              onUpdate={handleUpdateProduct}
              onDelete={handleDeleteProduct}
              onReorder={handleReorder}
            />
          )}
        </Section>
      </MainContent>
    </PageLayout>
  );
}
