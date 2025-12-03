import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  PageLayout,
  Container,
  Spacer,
  Centered,
} from "@/src/layout/container.layout";
import { Card } from "@/src/layout/card.layout";
import { Text } from "@/src/layout/text.layout";
import { Input } from "@/src/layout/input.layout";
import { Button } from "@/src/layout/button.layout";
import { Loader } from "@/src/layout/loader.layout";
import { useToast } from "@/src/layout/toast.layout";
import { useAuth } from "@/src/context/auth.context";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/products");
    }
  }, [authLoading, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);

    const result = await login(email);

    setLoading(false);

    if (result.success) {
      showToast("Welcome!", "success");
      router.push("/products");
    } else {
      setError(result.error || "Login failed");
      showToast(result.error || "Login failed", "error");
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  if (authLoading) {
    return (
      <PageLayout>
        <Loader fullScreen />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container size="sm">
        <Centered fullHeight padding="lg">
          <Card padding="lg" shadow="lg">
            <Text variant="h1" align="center" gradient>
              Product List
            </Text>
            <Spacer size="sm" />
            <Text variant="body" color="muted" align="center">
              Enter your email to access your products
            </Text>
            <Spacer size="lg" />
            <form onSubmit={handleSubmit}>
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onKeyDown={handleKeyDown}
                placeholder="you@example.com"
                label="Email address"
                error={error}
                autoFocus
              />
              <Spacer size="lg" />
              <Button type="submit" fullWidth loading={loading}>
                Continue
              </Button>
            </form>
          </Card>
        </Centered>
      </Container>
    </PageLayout>
  );
}
