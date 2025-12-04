import "@/app/globals.css";
import type { Metadata } from "next";
import AuthProvider from "@/config/auth-provider";

export const metadata: Metadata = {
  title: "Product List App",
  description: "Manage your personal product list",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
