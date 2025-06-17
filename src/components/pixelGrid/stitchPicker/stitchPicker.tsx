import Image from "next/image";
import { ActiveStitchPalette } from "@/hooks/pixelGrid/usePixelGridEditingConfigTools";
import { useState } from "react";
import { useRefWithClickawayListener } from "@/hooks/general/useRefWithClickawayListener";
import { knitting } from "@/constants/pixelGrid/stitches";

export default function StitchPicker({
  activeStitchPalette,
  activeStitchIdx,
  setActiveStitchIdx,
  swapStitchInPalette,
}: {
  activeStitchPalette: ActiveStitchPalette;
  activeStitchIdx: number;
  setActiveStitchIdx: React.Dispatch<React.SetStateAction<number>>;
  swapStitchInPalette: (stitchIdx: number, stitch: string) => void;
}) {
  return (
    <div className="flex">
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
        <div className="absolute pointer-events-none:">
          <section
            className={`card relative w-sm z-20 overflow-y-scroll left-[-50%] pointer-events-auto fadeInFast`}
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
          </section>
        </div>
      )}
    </div>
  );
};
