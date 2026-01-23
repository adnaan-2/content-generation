import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Media Generator",
  description: "Generate images and videos from text prompts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
