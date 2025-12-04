"use server";

import { signIn, signOut } from "@/config/auth";
import { AuthError } from "next-auth";

export async function authenticate(email: string) {
  try {
    const result = await signIn("credentials", {
      email,
      redirect: false,
    });
    
    if (result?.error) {
      return { success: false, error: result.error };
    }
    
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Authentication failed" };
    }
    console.error("Authentication error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

export async function logout() {
  await signOut({ redirect: false });
}
