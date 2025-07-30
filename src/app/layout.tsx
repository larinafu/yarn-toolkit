import type { Metadata } from "next";
import { afacad } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Yarn Toolkit",
  title: {
    template: "%s | Yarn Toolkit",
    default: "Free Knitting Chart Maker | Yarn Toolkit",
  },
  description:
    "Design custom knitting charts for colorwork, lace, and more with our free online knitting chart generator.",
  keywords: [
    "knitting chart generator",
    "knitting pattern maker",
    "colorwork knitting",
    "lace knitting",
    "crochet chart",
    "pixel art knitting",
  ],
  openGraph: {
    title: "Yarn Toolkit - Free Knitting Chart Maker",
    description:
      "Easily create and customize knitting charts for colorwork, lace, and more. No software download required.",
    url: "https://yarntoolkit.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yarn Toolkit - Free Knitting Chart Maker",
    description:
      "Easily create and customize knitting charts for colorwork, lace, and more. No software download required.",
  },
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
