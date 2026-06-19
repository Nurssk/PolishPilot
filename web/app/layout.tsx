import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Design Humanizer",
  description: "Make your AI-generated UI feel product-ready."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
