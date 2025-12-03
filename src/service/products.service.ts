import { API_BASE_URL } from "@/src/config/constants.config";
import { getToken } from "./auth.service";
import { ApiResponse, Product, ProductInput, ReorderInput } from "@/src/types";

async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  return response.json();
}

export async function getProducts(): Promise<ApiResponse<Product[]>> {
  return fetchWithAuth(`${API_BASE_URL}/products`);
}

export async function getProduct(id: string): Promise<ApiResponse<Product>> {
  return fetchWithAuth(`${API_BASE_URL}/products/${id}`);
}

export async function createProduct(
  input: ProductInput
): Promise<ApiResponse<Product>> {
  return fetchWithAuth(`${API_BASE_URL}/products`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<ApiResponse<Product>> {
  return fetchWithAuth(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteProduct(id: string): Promise<ApiResponse<null>> {
  return fetchWithAuth(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
  });
}

export async function reorderProducts(
  input: ReorderInput
): Promise<ApiResponse<Product[]>> {
  return fetchWithAuth(`${API_BASE_URL}/products/reorder`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
