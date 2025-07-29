import Link from "next/link";
import Image from "next/image";
import ScreenDemo from "@/components/general/screenDemo/screenDemo";
import JsonLd from "@/components/general/jsonLd/jsonLd";

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Yarn Toolkit",
  url: "https://yarntoolkit.com",
  description:
    "Design custom knitting charts for colorwork, lace, and more with our free online knitting chart generator.",
  publisher: {
    "@type": "Person",
    name: "Larina F.",
    address: {
      "@type": "PostalAddress",
      addressRegion: "New Jersey",
      addressCountry: "US",
    },
  },
  inLanguage: "en",
  keywords: [
    "knitting chart generator",
    "knitting pattern maker",
    "colorwork knitting",
    "lace knitting",
    "crochet chart",
    "pixel art knitting",
  ],
};

const SOFTWARE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Yarn Toolkit",
  operatingSystem: "Web",
  applicationCategory: "DesignApplication",
  description:
    "A free browser-based tool to design knitting charts for colorwork, lace, cables, and more.",
  url: "https://yarntoolkit.com",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  screenshot: "https://yarntoolkit.com/photos/laptop-editor.png",
  creator: {
    "@type": "Person",
    name: "Larina F.",
  },
};

const SAMPLE_PATTERNS = [
  {
    src: "/photos/patterns/lace.png",
    alt: "Lace knitting chart pattern with openwork stitch design generated using Yarn Toolkit knitting chart maker",
  },
  {
    src: "/photos/patterns/repeating-hearts.png",
    alt: "Repeating hearts colorwork chart generated using Yarn Toolkit knitting chart maker",
  },
  {
    src: "/photos/patterns/cable-chart.png",
    alt: "Knitting cable chart with diamond motif generated using Yarn Toolkit knitting chart maker",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd json={WEBSITE_SCHEMA} />
      <JsonLd json={SOFTWARE_SCHEMA} />
      <section className={`m-5`}>
        <h1 className="text-5xl mb-2">
          <Link href={"/create?source=blank"}>Free Knitting Chart Maker</Link>
        </h1>
        <h2 className="text-3xl mb-2">
          Design Your Own Colorwork and Lace Patterns, and More
        </h2>
        <p>
          Yarn Toolkit helps knitters design custom stitch charts directly in
          the browser. Whether you&apos;re creating stranded colorwork, openwork
          lace, or cable knitting motifs, our free knitting chart generator lets
          you start from scratch or start off with a photo—no software
          installation required.
        </p>
        <div className="relative">
          <Image
            src="/yarn-thread.svg"
            alt=""
            aria-hidden="true"
            width={1000}
            height={50}
            className="absolute w-full m-auto top-0 bottom-0"
          />
          <div className="m-auto flex justify-center items-center">
            {SAMPLE_PATTERNS.map((pattern, idx) => (
              <div className="w-3/4 h-1/4 lg:w-1/4 flex" key={idx}>
                <Image
                  src={pattern.src}
                  alt={pattern.alt}
                  width={1000}
                  height={1000}
                  className="max-h-full w-auto max-w-full m-auto z-20 px-1"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={`bg-amaranth-light p-5`}>
        <h2 className="text-5xl">
          Easy-To-Use Pattern Design Interface on all Screen Sizes
        </h2>
        <div className="flex justify-center">
          <ScreenDemo />
        </div>
      </section>
      <section className={`m-5`}>
        <h2 className="text-5xl mb-2">
          <Link href={"/create?source=image"}>
            Turn Photos into Pixel Art Patterns
          </Link>
        </h2>
        <p className="mb-2">
          Our image to chart Converter lets you upload images generate
          pixel-based knitting or crochet charts for intarsia and
          colorworkEasily convert photos into colorwork knitting patterns with
          our automatic image-to-chart tool. Upload any image and get a
          pixelated knitting or crochet chart you can use for intarsia, tapestry
          crochet, or fair isle. Control color depth and pattern dimensions to
          match your project.
        </p>
        <div className="flex justify-center items-center">
          <Image
            src={"/photos/earth.jpg"}
            width={1000}
            height={1000}
            alt="Drawing of Earth to be converted to a color chart"
            className="border border-black w-5/12"
          />
          <Image
            src={"/curve-right-arrow.svg"}
            width={400}
            height={400}
            alt="Rightward curved arrow illustrating image-to-pattern conversion flow"
            className="size-1/6"
          />
          <Image
            src="/photos/earth-pixelated.png"
            width={1000}
            height={1000}
            alt="Pixelated Earth image symbolizing automatic image to knitting chart conversion"
            className="w-5/12"
          />
        </div>
      </section>
      <Link
        href="create"
        className="block sticky bottom-2 right-0 ml-auto button text-4xl md:text-5xl rounded-3xl w-fit m-5 z-30"
      >
        create pattern
      </Link>
    </>
  );
}
