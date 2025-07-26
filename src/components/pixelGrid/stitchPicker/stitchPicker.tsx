import Image from "next/image";
import { ActiveStitchPalette } from "@/hooks/pixelGrid/usePixelGridEditingConfigTools";
import { useState } from "react";
import { useRefWithClickawayListener } from "@/hooks/general/useRefWithClickawayListener";
import {
  KNITTING_STITCHES,
  KNITTING_CABLE_STITCHES,
} from "@/constants/pixelGrid/stitches";
import SimpleColorPicker from "../simpleColorPicker/simpleColorPicker";
import { getCableStitchWidthUnits } from "@/utils/general/stitchUtils";

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
  const [isCable, setCable] = useState<boolean>(false);
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
        <Image
          src={
            (KNITTING_STITCHES[stitch] || KNITTING_CABLE_STITCHES[stitch]).svg
          }
          alt={stitch}
          width={25}
          height={25}
        />
      </button>
      {openExpand && (
        <section
          className={`absolute card overflow-auto z-40 left-0 right-0 m-auto w-xs fadeInFast`}
        >
          <div className="relative flex items-center bg-amaranth-light rounded-full transition-all duration-300 m-1">
            {/* Slider */}
            <div
              className={`absolute top-0 left-0 bottom-0 w-1/2 h-full flex transition-transform duration-300 ${
                isCable ? "translate-x-full" : "translate-x-0"
              }`}
            >
              <div className="grow m-1 bg-white rounded-full shadow-md"></div>
            </div>

            {/* Buttons */}
            <div className="relative z-10 flex w-full">
              <button
                className={`buttonBlank w-1/2 my-1 text-sm font-medium rounded-full transition-colors duration-300 ${
                  isCable ? "text-gray-500" : "text-black"
                }`}
                onClick={() => setCable(false)}
              >
                regular
              </button>
              <button
                className={`buttonBlank w-1/2 my-1 text-sm font-medium rounded-full transition-colors duration-300 ${
                  isCable ? "text-black" : "text-gray-500"
                }`}
                onClick={() => setCable(true)}
              >
                cable
              </button>
            </div>
          </div>

          <section
            className={`${
              isCable
                ? "max-h-75 overflow-auto"
                : "flex flex-wrap justify-center"
            }`}
          >
            {isCable
              ? Object.entries(KNITTING_CABLE_STITCHES).map(
                  ([stitchKey, stitch]) => {
                    const width = getCableStitchWidthUnits(stitchKey) * 30;
                    return (
                      <div key={stitchKey} className="flex items-center">
                        <button
                          className={`buttonBlank p-0 m-1 border border-gray-500 shrink-0`}
                          onClick={() => {
                            swapStitchInPalette(idx, stitchKey);
                            setOpenExpand(false);
                          }}
                        >
                          <Image
                            src={stitch.svg}
                            alt={stitch.name}
                            width={width}
                            height={30}
                          />
                        </button>
                        <p>{stitch.name}</p>
                      </div>
                    );
                  }
                )
              : Object.entries(KNITTING_STITCHES).map(([stitchKey, stitch]) => (
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
        </section>
      )}
    </div>
  );
};
