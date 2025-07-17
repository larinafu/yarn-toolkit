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
      <h1 className="mt-2 mb-2 text-center text-4xl md:text-5xl">
        Create New Pattern
      </h1>
      <p className="text-center ml-1 mr-1 mb-6 text-2xl md:text-3xl">
        How would you like to start your pattern?
      </p>
      <section className="flex justify-evenly">
        <div
          className={`card m-2 hover:cursor-pointer ${
            styles.card
          } ${addSelectedBorder("image")}`}
          onClick={() => handleBaseChoice("image")}
          tabIndex={0}
        >
          <h3 className={cardHeaderStyle}>Upload image</h3>
          <p className={cardSubheaderStyle}>
            We&apos;ll match the initial colors on your grid to fit your image
          </p>
          <Image
            src="/image.svg"
            alt="image"
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
          <h3 className={cardHeaderStyle}>Start from scratch</h3>
          <p className={cardSubheaderStyle}>
            We&apos;ll start you off with a blank grid
          </p>
          <Image
            src="/grid.svg"
            alt="grid denoting blank pattern"
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
