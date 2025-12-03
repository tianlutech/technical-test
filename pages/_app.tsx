import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastProvider } from "@/src/layout/toast.layout";
import { AuthProvider } from "@/src/context/auth.context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </AuthProvider>
  );
}
