// Frontend service layer - handles API calls from components to backend
export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  amount: number;
  comment: string | null;
  order: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
}

export interface CreateProductRequest {
  name: string;
  amount: number;
  comment?: string;
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

export interface UpdateProductRequest {
  name?: string;
  amount?: number;
  comment?: string;
}

export interface UpdateProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

class ApiClient {
  private baseUrl = '/api';
  private token: string | null = null;

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  // Get stored token
  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  // Clear token
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Generic API call method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth API calls
  async login(email: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    // Store token after successful login
    this.setToken(response.token);
    return response;
  }

  logout() {
    this.clearToken();
  }

  // Product API calls - VIEW ALL PRODUCTS
  async getProducts(): Promise<Product[]> {
    const response = await this.request<ProductsResponse>('/product');
    return response.products;
  }

  // Product API calls - CREATE PRODUCT
  async createProduct(productData: CreateProductRequest): Promise<Product> {
    const response = await this.request<CreateProductResponse>('/product', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return response.product;
  }

  // Product API calls - UPDATE PRODUCT
  async updateProduct(productId: string, productData: UpdateProductRequest): Promise<Product> {
    const response = await this.request<UpdateProductResponse>(`/product/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return response.product;
  }

  // Product API calls - DELETE PRODUCT
  async deleteProduct(productId: string): Promise<void> {
    await this.request<DeleteProductResponse>(`/product/${productId}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();