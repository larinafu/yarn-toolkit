import type { Metadata } from "next";
import { afacad } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Yarn Toolkit",
  title: {
    template: "%s | Yarn Toolkit",
    default:
      "Create knitting charts and crochet patterns for free | Yarn Toolkit",
  },
  description:
    "Create custom knitting charts for free on Yarn Toolkit. Design colorwork, cables, and lace charts with ease—optimized for all devices.",
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
