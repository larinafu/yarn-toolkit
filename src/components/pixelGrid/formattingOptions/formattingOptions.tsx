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
}: {
  numberFormat: PixelGridNumberFormat;
  setNumberFormat: React.Dispatch<React.SetStateAction<PixelGridNumberFormat>>;
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
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
          <form>
            <fieldset className="flex">
              {(
                Object.entries(numberFormattingOptions) as [
                  PixelGridNumberFormat,
                  any
                ][]
              ).map(([id, option]) => (
                <div
                  key={id}
                  className={`rounded-lg p-1 ${
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
        </div>
      </Dropdown>
    </>
  );
}
