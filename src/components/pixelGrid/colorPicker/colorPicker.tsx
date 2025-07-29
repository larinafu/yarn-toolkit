import Image from "next/image";
import { useRefWithClickawayListener } from "@/hooks/general/useRefWithClickawayListener";
import styles from "./colorPicker.module.css";
import { useState } from "react";
import { getColor } from "@/utils/general/colorUtils";
import { DEFAULT_COLORS } from "@/constants/colors";

export default function ColorPicker({
  activeColorPalette,
  swapColorInPalette,
  activeColorIdx,
  setActiveColorIdx,
}: {
  activeColorPalette: [string, number][];
  swapColorInPalette: (colorIdx: number, hex: string) => void;
  activeColorIdx: number;
  setActiveColorIdx: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="flex items-center justify-center rounded-2xl h-fit w-fit">
      {activeColorPalette.map(([colorHex, _], idx) => (
        <ColorOption
          key={idx}
          colorHex={colorHex}
          colorIdx={idx}
          selected={idx === activeColorIdx}
          swapColorInPalette={swapColorInPalette}
          setActiveColorIdx={setActiveColorIdx}
        />
      ))}
    </div>
  );
}

const ColorOption = ({
  colorHex,
  colorIdx,
  selected,
  swapColorInPalette,
  setActiveColorIdx,
}: {
  colorHex: string;
  colorIdx: number;
  selected: boolean;
  swapColorInPalette: (colorIdx: number, hex: string) => void;
  setActiveColorIdx: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [openExpand, setOpenExpand] = useState(false);
  const expandRef = useRefWithClickawayListener(() => setOpenExpand(false), []);
  const handlePaletteSelection = () => {
    if (selected) {
      setOpenExpand(!openExpand);
    } else {
      setActiveColorIdx(colorIdx);
    }
  };
  return (
    <div ref={expandRef}>
      <button
        className={`buttonBlank ${styles.mainColor} shadow flex items-center justify-center size-10 m-2 p-2`}
        key={`${colorHex}-main`}
        onClick={handlePaletteSelection}
        style={{
          backgroundColor: colorHex,
        }}
      >
        {selected && (
          <Image
            className={`${styles.plus} size-4/5`}
            width={20}
            height={20}
            src={getColor(colorHex).isDark ? "/pen-light.svg" : "/pen-dark.svg"}
            alt="plus"
          />
        )}
      </button>
      {openExpand && (
        <section className="absolute card overflow-auto z-40 left-0 right-0 m-auto w-fit fadeInFast">
          {DEFAULT_COLORS.map((colorRow, idx) => (
            <div key={idx} className="flex">
              {Object.values(colorRow).map((expandedColorHex) => (
                <button
                  key={expandedColorHex.hex}
                  className="size-6 m-1 border border-gray-500"
                  onClick={() => {
                    swapColorInPalette(colorIdx, expandedColorHex.hex);
                    setOpenExpand(false);
                  }}
                  style={{
                    backgroundColor: expandedColorHex.hex,
                  }}
                ></button>
              ))}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
