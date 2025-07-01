import Link from "next/link";
import Image from "next/image";

const headerStyle = "p-2 text-5xl";
const bannerStyle = "";

const SAMPLE_PATTERNS = [
  {
    src: "/photos/patterns/repeating-hearts.png",
    alt: "repeating hearts",
  },
  { src: "/photos/patterns/lace.png", alt: "lace" },
  {
    src: "/photos/patterns/flower.png",
    alt: "flower",
  },
];

export default function Home() {
  return (
    <>
      <div className={`${bannerStyle} bg-amaranth-light`}>
        <div className="p-2 text-5xl">
          <h1 className="m-4">Create knitting charts for free.</h1>
          <div className="flex flex-col lg:flex-row justify-center items-center relative">
            <Image
              src="/yarn-thread.svg"
              alt="yarn thread"
              width={1000}
              height={50}
              className="hidden lg:block absolute w-full m-auto top-0 bottom-0"
            />
            <Image
              src="/yarn-thread-vert.svg"
              alt="yarn thread vertical"
              width={1000}
              height={50}
              className="lg:hidden absolute h-full m-auto left-0 right-0 top-0"
            />
            {SAMPLE_PATTERNS.map((pattern, idx) => (
              <div className="w-3/4 lg:w-1/4 flex" key={idx}>
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
      </div>
      <div className={`${bannerStyle} p-2`}>
        <div className={headerStyle}>
          <h1 className="m-4">
            Instantly generate color charts from uploaded images.
          </h1>
          <div className="p-4 flex flex-col sm:flex-row justify-center items-center">
            <Image
              src={"/photos/earth.jpg"}
              width={400}
              height={400}
              alt="earth"
              className="border border-black size-full sm:size-1/4"
            />
            <Image
              src={"/curve-right-arrow.svg"}
              width={100}
              height={100}
              alt="arrow"
              className="rotate-90 sm:rotate-0 size-1/3 sm:size-1/6"
            />
            <Image
              src="/photos/earth-pixelated.png"
              width={400}
              height={400}
              alt="pixelated earth"
              className="size-full sm:size-1/4"
            />
          </div>
        </div>
      </div>
      <Link
        href="create"
        className="block sticky bottom-2 right-0 ml-auto button text-3xl rounded-3xl w-fit m-5 z-30"
      >
        create now
      </Link>
    </>
  );
}
