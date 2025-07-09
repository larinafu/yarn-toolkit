import type { Metadata } from "next";
import Create from "./create";
import { SearchParams } from "@/types/general";
import { BaseOption } from "@/types/pixelGrid";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  let title = "Online Knitting Chart Maker - Design Custom Stitch Patterns";
  let description =
    "Create detailed knitting charts with our easy-to-use online editor. Draw stitch patterns, use color tools, and export custom designs—all in your browser.";
  const { source } = await searchParams;
  switch (source as BaseOption) {
    case "image":
      title =
        "Image to Knitting Chart Maker - Create Custom Color Patterns";
      description =
        "Easily turn any image into a custom knitting chart. Upload your photo and generate a detailed color pattern with our free chart-making tool.";
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
  return <Create source={(await searchParams).source as BaseOption} />;
}
