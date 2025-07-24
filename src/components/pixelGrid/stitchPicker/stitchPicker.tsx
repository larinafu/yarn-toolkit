import Image from "next/image";
import { ActiveStitchPalette } from "@/hooks/pixelGrid/usePixelGridEditingConfigTools";
import { useState } from "react";
import { useRefWithClickawayListener } from "@/hooks/general/useRefWithClickawayListener";
import { knitting } from "@/constants/pixelGrid/stitches";
import SimpleColorPicker from "../simpleColorPicker/simpleColorPicker";

type StitchCategory = "simple" | "cable";

export default function StitchPicker({
  activeStitchPalette,
  activeStitchIdx,
  setActiveStitchIdx,
  swapStitchInPalette,
  stitchColor,
  setStitchColor,
}: {
  activeStitchPalette: ActiveStitchPalette;
  activeStitchIdx: number;
  setActiveStitchIdx: React.Dispatch<React.SetStateAction<number>>;
  swapStitchInPalette: (stitchIdx: number, stitch: string) => void;
  stitchColor: string;
  setStitchColor: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex items-center">
      <div className="flex overflow-x-auto">
        {activeStitchPalette.map((stitch, idx) => (
          <StitchOption
            key={idx}
            idx={idx}
            selected={activeStitchIdx === idx}
            setActiveStitchIdx={setActiveStitchIdx}
            swapStitchInPalette={swapStitchInPalette}
            stitch={stitch}
          />
        ))}
      </div>
      <div className="p-1 bg-white right-0 shrink-0">
        <SimpleColorPicker hex={stitchColor} setHex={setStitchColor} />
      </div>
    </div>
  );
}

const StitchOption = ({
  idx,
  selected,
  setActiveStitchIdx,
  stitch,
  swapStitchInPalette,
}: {
  idx: number;
  selected: boolean;
  setActiveStitchIdx: React.Dispatch<React.SetStateAction<number>>;
  stitch: string;
  swapStitchInPalette: (stitchIdx: number, stitch: string) => void;
}) => {
  const [openExpand, setOpenExpand] = useState(false);
  const expandRef = useRefWithClickawayListener(() => setOpenExpand(false), []);
  const handlePaletteSelection = () => {
    if (selected) {
      setOpenExpand(!openExpand);
    } else {
      setActiveStitchIdx(idx);
    }
  };
  return (
    <div ref={expandRef}>
      <button
        key={idx}
        className={`buttonBlank p-2 m-2 rounded-sm ${
          selected
            ? "border-amaranth hover:border-amaranth active:border-amaranth"
            : "border-gray-400 hover:border-gray-400 active:border-gray-400"
        } size-10`}
        onClick={handlePaletteSelection}
      >
        <Image src={knitting[stitch].svg} alt={stitch} width={25} height={25} />
      </button>
      {openExpand && (
        <section
          className={`absolute card overflow-auto z-40 left-0 right-0 m-auto w-xs sm:w-sm fadeInFast`}
        >
          {Object.entries(knitting).map(([stitchKey, stitch]) => (
            <button
              key={stitchKey}
              className="buttonBlank p-1 size-10 m-1 border border-gray-500"
              onClick={() => {
                swapStitchInPalette(idx, stitchKey);
                setOpenExpand(false);
              }}
            >
              <Image
                src={stitch.svg}
                alt={stitchKey}
                width={20}
                height={20}
                className="w-full h-full"
              />
            </button>
          ))}
          <button className="flex rounded-4xl h-7">
            <p>cable</p>
            <Image
              width={20}
              height={20}
              alt="right arrow"
              src={"/right-line-arrow.svg"}
            />
          </button>
        </section>
      )}
    </div>
  );
};
