import Image from "next/image";
import Dropdown from "@/components/general/dropdown/dropdown";

import React from "react";
import {
  PixelGridCanvasSavedData,
  PixelGridNumberFormat,
} from "@/types/pixelGrid";

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
}: {
  numberFormat: PixelGridNumberFormat;
  setNumberFormat: React.Dispatch<React.SetStateAction<PixelGridNumberFormat>>;
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  gridLineColor: string;
  setGridLineColor: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <>
      <Dropdown
        btnContent={
          <Image
            src={"/gridNumberFormat/numbers-between.svg"}
            alt="grid"
            height={80}
            width={80}
            className="card pd-0"
          />
        }
      >
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
            <button
              className={`buttonBlank ${
                gridLineColor === "#000000" ? "bg-amaranth-light" : ""
              }`}
              onClick={() => setGridLineColor("#000000")}
            >
              <div className="size-5 rounded-full bg-black shadowBig"></div>
            </button>
            <button
              className={`buttonBlank ${
                gridLineColor === "#FFFFFF" ? "bg-amaranth-light" : ""
              }`}
              onClick={() => setGridLineColor("#FFFFFF")}
            >
              <div className="size-5 rounded-full bg-white shadowBig"></div>
            </button>
          </div>
        </div>
      </Dropdown>
    </>
  );
}
