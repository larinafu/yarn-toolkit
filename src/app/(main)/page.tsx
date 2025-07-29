import Link from "next/link";
import Image from "next/image";
import ScreenDemo from "@/components/general/screenDemo/screenDemo";

const SAMPLE_PATTERNS = [
  {
    src: "/photos/patterns/repeating-hearts.png",
    alt: "Repeating hearts knitting chart pattern for colorwork projects",
  },
  {
    src: "/photos/patterns/lace.png",
    alt: "Lace knitting chart pattern with openwork stitch design",
  },
  {
    src: "/photos/patterns/flower.png",
    alt: "Floral knitting chart pattern featuring pixelated flower design",
  },
];

export default function Home() {
  return (
    <>
      <section className={`p-2`}>
        <h1 className="pt-4 text-5xl mb-5 md:text-6xl lg:text-7xl">
          <Link href={"/create?source=blank"}>Free Knitting Chart Maker</Link>
        </h1>
        <h2 className="text-3xl mb-5">
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
            alt="yarn thread"
            width={1000}
            height={50}
            className="absolute w-full m-auto top-0 bottom-0"
          />
          {/* <Image
            src="/yarn-thread-vert.svg"
            alt="yarn thread vertical"
            width={1000}
            height={50}
            className="lg:hidden absolute h-full m-auto left-0 right-0 top-0"
          /> */}
          <div className="m-auto flex justify-center items-center">
            {SAMPLE_PATTERNS.map((pattern, idx) => (
              <div className="w-3/4 h-1/4 lg:w-1/4 flex" key={idx}>
                <Image
                  src={pattern.src}
                  alt={pattern.alt}
                  width={1000}
                  height={1000}
                  className="max-h-full w-auto max-w-full m-auto z-20"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        className={`p-2 flex flex-col lg:flex-row justify-evenly items-center bg-amaranth-light lg:h-200`}
      >
        <h1 className="m-4 lg:w-1/2 text-5xl md:text-6xl lg:text-7xl lg:ml-20">
          Easy-To-Use Pattern Design Interface on Desktop, Tablet, or Phone
        </h1>
        <div className="flex justify-center">
          <ScreenDemo />
        </div>
      </section>
      <section className={`p-2 pt-10`}>
        <h1 className="lg:w-1/2 text-5xl md:text-6xl lg:text-7xl">
          <Link href={"/create?source=image"}>
            Turn Photos into Pixel Art Patterns
          </Link>
        </h1>
        <h2 className="text-3xl">
          Our image to chart Converter lets you upload images generate
          pixel-based knitting or crochet charts for intarsia and colorwork
        </h2>
        <p>
          Easily convert photos into colorwork knitting patterns with our
          automatic image-to-chart tool. Upload any image and get a pixelated
          knitting chart you can use for intarsia, tapestry crochet, or fair
          isle. Control color depth and pattern dimensions to match your
          project.
        </p>
        <div className="p-4 flex justify-center items-center">
          <Image
            src={"/photos/earth.jpg"}
            width={1000}
            height={1000}
            alt="Drawing of Earth to be converted to a color chart"
            className="border border-black w-1/3"
          />
          <Image
            src={"/curve-right-arrow.svg"}
            width={400}
            height={400}
            alt="Rightward curved arrow illustrating image-to-pattern conversion flow"
            className="size-1/4"
          />
          {/* <Image
            src={"/curve-down-arrow.svg"}
            width={400}
            height={400}
            alt="Downward curved arrow indicating image-to-chart conversion process"
            className="lg:hidden size-1/6"
          /> */}
          <Image
            src="/photos/earth-pixelated.png"
            width={1000}
            height={1000}
            alt="Pixelated Earth image symbolizing automatic image to knitting chart conversion"
            className="w-1/3"
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
