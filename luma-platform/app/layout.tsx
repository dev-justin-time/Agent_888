import type { Metadata } from "next';
import "./globals.css";

export const metadata: Metadata = {
  title: "LumaNation | Private Life Navigation",
  description:
    "A completely private, anonymous space to unpack your thoughts and navigate life's heavy days. No records kept.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
