import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple GA Viewer",
  description: "View your Google Analytics 4 data with a clean, simple dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
