import type { Metadata } from "next";
import { afacad } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Yarn Toolkit",
  title: {
    template: "%s | Yarn Toolkit",
    default: "Yarn Toolkit",
  },
  description:
    "Create knitting charts and crochet patterns for free. Easily convert uploaded images into beautiful color charts instantly.",
  keywords: [
    "crochet",
    "knitting",
    "yarn",
    "knitting chart",
    "knitting pattern",
    "pattern",
    "chart",
    "image",
  ],
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
