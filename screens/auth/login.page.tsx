"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Input from "@/layout/input.layout";
import Button from "@/layout/button.layout";
import Card from "@/layout/card.layout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        redirect: false,
        callbackUrl: "/products",
      });

      if (result?.error) {
        setError("Authentication failed. Please try again.");
        setLoading(false);
      } else if (result?.ok) {
        router.push("/products");
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Authentication failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Product List App</h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your email to continue
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            disabled={loading}
          />
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Logging in..." : "Continue"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
