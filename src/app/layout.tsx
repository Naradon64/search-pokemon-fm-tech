import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "search-pokemon-fm-tech",
  description: "Pokemon search application for the FM Full Stack Developer test.",
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
