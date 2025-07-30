import JsonLd from "@/components/general/jsonLd/jsonLd";
import ScreenDemo from "@/components/general/screenDemo/screenDemo";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Yarn Toolkit is the essential digital workspace for fiber artists, offering powerful tools to design knitting charts with ease. Create, edit, and convert patterns effortlessly using our intuitive web-based platform.",
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Yarn Toolkit",
  url: "https://yarntoolkit.com/about",
  description:
    "Learn about the mission and features of Yarn Toolkit — a free, web-based knitting chart maker designed to empower fiber artists with intuitive editing tools and chart generators.",
  mainEntity: {
    "@type": "WebApplication",
    name: "Yarn Toolkit",
    url: "https://yarntoolkit.com",
    applicationCategory: "DesignApplication",
    operatingSystem: "All",
    creator: {
      "@type": "Person",
      name: "Larina F.",
      url: "https://yarntoolkit.com",
    },
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
    },
    featureList: [
      "Knitting chart editor with customizable symbols and color palette",
      "Image-to-chart converter for pixel-based knitting designs",
      "Export charts as PNGs",
      "Web-based, no installation required",
    ],
  },
};

export default function Page({}) {
  return (
    <>
      <JsonLd json={SCHEMA} />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <section>
          <h1 className="text-5xl mb-2">Mission</h1>
          <p className="mb-4">
            Originally created to provide knitters with a robust editing
            platform for crafting intricate patterns and detailed knitting
            charts, Yarn Toolkit&apos;s mission has grown to become the
            essential digital workspace for all needlework creators—whether your
            passion lies in knitting, crochet, cross-stitch, or any other
            thread-based craft. This site strives to be a virtual extension of
            your hands, where creativity flows without friction and technical
            limitations never hold you back.
          </p>
          <div className="h-1/2 m-auto">
            <ScreenDemo />
          </div>
          <p className="mb-10">
            Much like a trusted toolkit that a skilled craftsperson relies on to
            construct complex, beautiful works, Yarn Toolkit was created to
            simplify the planning and design process so that more time can be
            spent making. This site aims to remove the barriers of repetitive
            manual charting and confusing symbol placement, making the journey
            from idea to finished project as smooth, intuitive, and enjoyable as
            possible. With Yarn Toolkit, you&apos;re not just
            designing—you&apos;re crafting with confidence and freedom.
          </p>
        </section>
        <section>
          <h2 className="text-5xl mb-2">What This Site Offers</h2>
          <p className="mb-4">
            Yarn Toolkit offers a suite of user-friendly tools tailored
            specifically to the needs of fiber artists. At its core is a
            powerful, web-based editing interface that lets users create
            visually rich knitting charts using familiar symbols and a
            customizable color palette. The intuitive drawing tools make it easy
            to place stitches, change colors, and shape your designs row by row,
            all within a structured grid format that mirrors how patterns are
            typically read and followed. Finished patterns can then be
            downloaded as a PNG.
          </p>
          <p className="mb-10">
            For those who prefer visual inspiration, Yarn Toolkit also includes
            an{" "}
            <Link
              href="/create?source=image"
              className="text-blue-600 underline"
            >
              image-to-chart converter
            </Link>
            . This feature allows users to upload an image—such as a logo,
            photo, or drawing—which is then automatically pixelated and
            translated into a color chart. From there, users can fine-tune the
            design manually using the editor. This helps bridge the gap between
            inspiration and execution, empowering crafters to bring even the
            most complex ideas to life with greater ease.
          </p>
        </section>
        <section>
          <h2 className="text-5xl mb-2">This is Just the Beginning!</h2>
          <p>
            As the platform evolves, I plan to expand this site&apos;s offerings
            to include support for other crafts like crochet and cross-stitch.
            Whether you&apos;re designing for yourself, teaching others, or
            publishing professional patterns, Yarn Toolkit is here to help you
            create without compromise!
          </p>
        </section>
      </div>
    </>
  );
}
