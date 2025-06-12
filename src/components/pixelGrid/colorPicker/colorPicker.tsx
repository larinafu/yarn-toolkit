import Image from "next/image";
import { useRefWithClickawayListener } from "@/hooks/general/useRefWithClickawayListener";
import styles from "./colorPicker.module.css";
import { useState } from "react";
import { getColor } from "@/utils/general/colorUtils";
import { defaultColorsConstants } from "@/constants/colors";

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
          key={colorHex}
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
    <div className="relative" ref={expandRef}>
      <button
        className={`buttonBlank ${styles.mainColor} shadow flex items-center justify-center`}
        key={`${colorHex}-main`}
        onClick={handlePaletteSelection}
        style={{
          backgroundColor: colorHex,
        }}
      >
        {selected && (
          <Image
            className={styles.plus}
            width={13}
            height={13}
            src={getColor(colorHex).isDark ? "/pen-light.svg" : "/pen-dark.svg"}
            alt="plus"
          />
        )}
      </button>
      {openExpand && (
        <div className={styles.expandContainer}>
          <section className={`card ${styles.expand}`}>
            {defaultColorsConstants.map((colorRow, idx) => (
              <div key={idx}>
                {Object.values(colorRow).map((expandedColorHex) => (
                  <button
                    key={expandedColorHex.hex}
                    className="m-2 inline-flex"
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
        </div>
      )}
    </div>
  );
};
