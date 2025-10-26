// src/app/layout.tsx - FIXED VERSION
import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Provider from "./provider";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Christian Business App",
  description: "Faith-driven business platform for connection and growth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Use standard Google Fonts via CDN instead of next/font */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body
          className="antialiased bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 min-h-screen"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          <ConvexClientProvider>
            <Provider>
              <Navbar />
              <main>{children}</main>
              <Toaster richColors />
            </Provider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
