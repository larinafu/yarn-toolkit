import Image from "next/image";

export default function ScreenDemo({}) {
  return (
    <div className="relative m-4">
      <Image
        src={"/photos/phone-editor.png"}
        alt={"Knitting chart generator tool on a phone screen"}
        width={1000}
        height={1000}
        objectFit="contain"
        className="absolute bottom-0 left-0 border-4 md:border-6 lg:border-8 border-gray-900 rounded-xl lg:rounded-3xl size-3/4 w-auto z-30"
      />
      <div className="pl-5 pb-4">
        <Image
          src={"/photos/laptop-editor.png"}
          alt={"Knitting chart generator tool on a laptop"}
          width={1000}
          height={1000}
          className="border-4 md:border-6 lg:border-8 border-gray-700 w-full rounded-xl lg:rounded-3xl z-20"
        />
      </div>
    </div>
  );
}
