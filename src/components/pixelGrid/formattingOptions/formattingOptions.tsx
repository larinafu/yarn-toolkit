import Image from "next/image";
import Dropdown from "@/components/general/dropdown/dropdown";

import React, { useRef } from "react";
import {
  PixelGridCanvasSavedData,
  PixelGridNumberFormat,
} from "@/types/pixelGrid";
import { PixelGridLineCanvasTools } from "@/hooks/pixelGrid/usePixelGridLineCanvasTools";
import { GRID_LINE_COLORS } from "@/constants/colors";

const numberFormattingOptions: {
  [key in PixelGridNumberFormat]: { displayText: string; img: string };
} = {
  numbersBetween: {
    displayText: "numbers in between spaces top to bottom",
    img: "/gridNumberFormat/numbers-between.svg",
  },
  numbersBetweenAlternating: {
    displayText: "numbers in between spaces, alternating up",
    img: "/gridNumberFormat/numbers-between-alternating.svg",
  },
  numbersBetweenRight: {
    displayText: "numbers in between spaces, right only, bottom to top",
    img: "/gridNumberFormat/numbers-between-right.svg",
  },
  numbersBetweenRightOdd: {
    displayText:
      "numbers in between spaces on the right, odd numbers only, bottom to top",
    img: "/gridNumberFormat/numbers-between-right-odd.svg",
  },
};

export default function FormattingOptions({
  numberFormat,
  setNumberFormat,
  savedCanvasDataRef,
  gridLineColor,
  setGridLineColor,
  gridLineTools,
}: {
  numberFormat: PixelGridNumberFormat;
  setNumberFormat: React.Dispatch<React.SetStateAction<PixelGridNumberFormat>>;
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  gridLineColor: string;
  setGridLineColor: React.Dispatch<React.SetStateAction<string>>;
  gridLineTools: PixelGridLineCanvasTools;
}) {
  return (
    <>
      <Dropdown btnContent={<span className="text-black">Format</span>} btnClass="p-2 w-full text-start">
        <div className="card p-0">
          <form className="pb-1 border-b border-b-amaranth">
            <fieldset className="flex">
              {(
                Object.entries(numberFormattingOptions) as [
                  PixelGridNumberFormat,
                  any
                ][]
              ).map(([id, option]) => (
                <div
                  key={id}
                  className={`rounded-lg p-1 mt-1 first:ml-1 last:mr-1 ${
                    id === numberFormat ? "bg-amaranth-light" : ""
                  }`}
                  onClick={() => {
                    setNumberFormat(id);
                    savedCanvasDataRef.current.numberFormat = id;
                  }}
                >
                  <input
                    type="radio"
                    id={id}
                    name={id}
                    value={id}
                    className="opacity-0 absolute"
                    checked={id === numberFormat}
                    onChange={() => {
                      setNumberFormat(id);
                      savedCanvasDataRef.current.numberFormat = id;
                    }}
                  />
                  <Image
                    src={option.img}
                    height={80}
                    width={80}
                    alt={option.displayText}
                  />
                </div>
              ))}
            </fieldset>
          </form>
          <div className="flex items-center p-2">
            {GRID_LINE_COLORS.map((color) => (
              <button
                key={color}
                className={`buttonBlank ${
                  gridLineColor === color ? "bg-amaranth-light" : ""
                }`}
                onClick={() => {
                  setGridLineColor(color);
                  gridLineTools.drawCanvasLines({ lineColor: color });
                }}
              >
                <div
                  style={{
                    backgroundColor: color,
                  }}
                  className={`size-5 rounded-full shadowBig`}
                ></div>
              </button>
            ))}
          </div>
        </div>
      </Dropdown>
    </>
  );
}
