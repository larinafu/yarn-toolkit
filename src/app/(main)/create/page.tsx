import type { Metadata } from "next";
import Create from "./create";
import { SearchParams } from "@/types/general";
import { BaseOption } from "@/types/pixelGrid";
import JsonLd from "@/components/general/jsonLd/jsonLd";

const SOFTWARE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Yarn Toolkit Chart Creator",
  operatingSystem: "Web",
  applicationCategory: "DesignApplication",
  description:
    "Use Yarn Toolkit's free chart creator to build custom knitting patterns from scratch or based on a photo. Customize every square in your design with our rich selection of stitches and colors.",
  url: "https://yarntoolkit.com/create",
  image: "https://yarntoolkit.com/photos/laptop-editor.png",
  browserRequirements: "Requires JavaScript and a modern browser.",
  creator: {
    "@type": "Person",
    name: "Larina F.",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    category: "free",
  },
  isAccessibleForFree: true,
  inLanguage: "en",
  applicationSuite: "Yarn Toolkit",
  featureList: [
    "Drag-and-drop stitch editing",
    "Color palette and symbol customization",
    "Import from image",
    "Chart export with watermark",
    "Real-time preview",
  ],
  keywords: [
    "knitting chart editor",
    "colorwork pattern maker",
    "lace knitting tool",
    "knitting pattern generator",
    "intarsia chart design",
  ],
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  let title = "Online Knitting Chart Maker - Design Custom Stitch Patterns";
  let description =
    "Start your knitting pattern with a blank grid or upload an image to auto-generate a knitting chart. Free, intuitive, and beginner-friendly chart maker.";
  const { source } = await searchParams;
  switch (source as BaseOption) {
    case "image":
      title = "Image to Knitting Chart Maker - Create Custom Color Patterns";
      description =
        "Upload an image to generate a pixel-based knitting chart. Ideal for converting logos and photos into colorwork patterns";
      break;
  }
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function CreatePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>
      <JsonLd json={SOFTWARE_SCHEMA} />
      <Create source={(await searchParams).source as BaseOption} />
    </>
  );
}
