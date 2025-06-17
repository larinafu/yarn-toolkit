import type { Metadata } from "next";
import { afacad } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yarn Toolkit",
  description: "Knitting Chart Generator",
  keywords: "yarn, knitting, crochet, pattern",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${afacad.className}`}>{children}</body>
    </html>
  );
}
