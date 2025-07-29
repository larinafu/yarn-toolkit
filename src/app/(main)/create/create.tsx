"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import styles from "./page.module.css";
import CreateWithImage from "@/components/pixelGrid/createWithImage/createWithImage";
import useScrollIntoView from "@/hooks/general/useScrollIntoView";
import InitCustomization from "@/components/pixelGrid/initCustomization/initCustomization";
import { BaseOption } from "@/types/pixelGrid";

const cardHeaderStyle = "text-xl sm:text-4xl mt-2";
const cardSubheaderStyle = "text-m sm:text-xl md:text-3xl m-4";

export default function Create({ source }: { source?: BaseOption }) {
  const [baseOption, setBaseOption] = useState<BaseOption | undefined>(source);
  const baseOptionRef = useRef(null);
  const handleBaseChoice = (option: BaseOption) => {
    setBaseOption(option);
  };

  useScrollIntoView(baseOptionRef, [baseOption]);

  const addSelectedBorder = (card: BaseOption) => {
    if (card === baseOption) {
      return styles.selected;
    }
    return "";
  };

  return (
    <div className={`fadeIn`}>
      <h1 className="mt-2 mb-2 text-center text-5xl">
        Create a Knitting Chart Online
      </h1>
      <p className="text-center text-xl m-auto mb-6 max-w-4/5">
        Use Yarn Toolkit's chart editor to turn an image into a pixel-based
        knitting pattern or create a custom knitting chart from scratch. No
        download required. Ideal for colorwork, lace, and projects of all
        difficulty levels.
      </p>
      <h2 className="text-center ml-1 mr-1 mb-6 text-3xl">
        How would you like to start your pattern?
      </h2>
      <section className="flex justify-evenly">
        <div
          className={`card m-2 hover:cursor-pointer ${
            styles.card
          } ${addSelectedBorder("image")}`}
          onClick={() => handleBaseChoice("image")}
          tabIndex={0}
        >
          <p className={cardHeaderStyle}>Upload image</p>
          <p className={cardSubheaderStyle}>
            We&apos;ll match the initial colors on your grid to fit your image
          </p>
          <Image
            src="/image.svg"
            alt="Convert an image to a knitting chart"
            width={100}
            height={100}
            className="m-2 size-1/3"
          />
        </div>
        <div
          className={`card m-2 hover:cursor-pointer ${
            styles.card
          } ${addSelectedBorder("blank")}`}
          onClick={() => handleBaseChoice("blank")}
          tabIndex={0}
        >
          <p className={cardHeaderStyle}>Start from scratch</p>
          <p className={cardSubheaderStyle}>
            We&apos;ll start you off with a blank grid
          </p>
          <Image
            src="/grid.svg"
            alt="Start from scratch using a blank knitting chart grid"
            width={100}
            height={100}
            className="m-2 size-1/3"
          />
        </div>
      </section>
      {baseOption &&
        (baseOption === "image" ? (
          <CreateWithImage />
        ) : (
          <section ref={baseOptionRef}>
            <InitCustomization />
          </section>
        ))}
    </div>
  );
}
