import Link from "next/link";
import Image from "next/image";

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
      <div className={`p-2`}>
        <h1 className="text-center pt-4 text-5xl md:text-6xl lg:text-8xl">
          Create knitting charts for free.
        </h1>
        <div className="relative">
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
          <div className="h-dvh min-h-300 lg:min-h-auto lg:w-11/12 lg:h-auto m-auto flex flex-col lg:flex-row justify-center items-center">
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
      </div>
      <div
        className={`p-2 flex flex-col lg:flex-row justify-evenly items-center bg-amaranth-light`}
      >
        <h1 className="m-4 lg:w-1/3 text-5xl md:text-6xl lg:text-8xl">
          Effortlessly edit across all devices
        </h1>
        <div className="flex justify-center">
          <div className="relative m-4">
            <Image
              src={"/photos/phone-editor.png"}
              alt={""}
              width={1000}
              height={1000}
              objectFit="contain"
              className="absolute bottom-0 left-0 border-4 md:border-6 lg:border-8 border-gray-900 rounded-xl lg:rounded-3xl size-3/4 w-auto z-30"
            />
            <div className="pl-5 pb-4">
              <Image
                src={"/photos/laptop-editor.png"}
                alt={""}
                width={1000}
                height={1000}
                className="border-4 md:border-6 lg:border-8 border-gray-700 w-full rounded-xl lg:rounded-3xl z-20"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`p-2 pt-10 flex flex-col-reverse lg:flex-row items-center`}
      >
        <div className="p-4 flex flex-col lg:flex-row justify-center items-center">
          <Image
            src={"/photos/earth.jpg"}
            width={1000}
            height={1000}
            alt="earth"
            className="border border-black sm:w-1/2 lg:w-1/3"
          />
          <Image
            src={"/curve-right-arrow.svg"}
            width={400}
            height={400}
            alt="arrow"
            className="hidden lg:block lg:rotate-0 size-1/4"
          />
          <Image
            src={"/curve-down-arrow.svg"}
            width={400}
            height={400}
            alt="arrow"
            className="lg:hidden size-1/6"
          />
          <Image
            src="/photos/earth-pixelated.png"
            width={1000}
            height={1000}
            alt="pixelated earth"
            className="sm:w-1/2 lg:w-1/3"
          />
        </div>
        <h1 className="m-4 lg:w-1/2 text-5xl md:text-6xl lg:text-8xl">
          Instantly generate color charts from uploaded images.
        </h1>
      </div>
      <Link
        href="create"
        className="block sticky bottom-2 right-0 ml-auto button text-4xl md:text-5xl rounded-3xl w-fit m-5 z-30"
      >
        create now
      </Link>
    </>
  );
}
