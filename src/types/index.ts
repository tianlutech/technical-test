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

export interface Session {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ProductInput {
  name: string;
  amount: number;
  comment?: string;
}

export interface ReorderInput {
  orderedIds: string[];
}
