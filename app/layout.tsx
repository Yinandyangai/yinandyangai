import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "yinandyang.ai — the operating system for AI-native businesses",
  description:
    "Learn AI in plain language. Build real systems for your business. Operate with leverage.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
