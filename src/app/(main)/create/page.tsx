"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { projectConstants } from "@/app/utils/constants";
import ProjectLimitErrorField from "../../../(authenticated)/projects/components/projectsContainer/projectLimitErrorField/projectLimitErrorField";
import gridIcon from "@/public/icons/frame-grid-icon.svg";
import imageIcon from "@/public/icons/image-line-icon.svg";

import BaseImageForm from "../baseImageForm/baseImageForm";
import useScrollTo from "@/app/utils/hooks/animations/useScrollTo";
import BaseForm from "../baseForm/baseForm";
import styles from "./newPixelArtPage.module.css";

type BaseOption = "image" | "scratch";

export default function Create() {
  const [baseOption, setBaseOption] = useState<BaseOption>(null);
  const baseOptionRef = useRef(null);
  const handleBaseChoice = (option: BaseOption) => {
    setBaseOption(option);
  };

  useScrollTo(baseOptionRef, [baseOption]);

  const addSelectedBorder = (card: BaseOption) => {
    if (card === baseOption) {
      return styles.selected;
    }
    return "";
  };

  return (
    <div className={`fadeIn`}>
      <h1 className={`${styles.header}`}>Create New Pattern</h1>
      <p className={styles.subHeader}>
        How would you like to start your pattern?
      </p>
      <section className={styles.cardContainer}>
        <div
          className={`card hoverable ${styles.card} ${addSelectedBorder(
            "image"
          )}`}
          onClick={() => handleBaseChoice("image")}
          tabIndex={0}
        >
          <h3>Upload image</h3>
          <p>We&apos;ll match the initial colors on your grid to fit your image</p>
          <Image src={imageIcon} alt="image" width={100} height={100} />
        </div>
        <div
          className={`card hoverable ${styles.card} ${addSelectedBorder(
            "scratch"
          )}`}
          onClick={() => handleBaseChoice("scratch")}
          tabIndex={0}
        >
          <h3>Start from scratch</h3>
          <p>We&apos;ll start you off with a blank grid</p>
          <Image
            src={gridIcon}
            alt="grid denoting blank pattern"
            width={100}
            height={100}
          />
        </div>
      </section>
      {baseOption && (
        <section ref={baseOptionRef}>
          {baseOption === "image" ? (
            <BaseImageForm isLoggedIn={isLoggedIn} />
          ) : (
            baseOption === "scratch" && <BaseForm isLoggedIn={isLoggedIn} />
          )}
        </section>
      )}

      {numProjects >= projectConstants.numProjectsLimit && (
        <ProjectLimitErrorField />
      )}
    </div>
  );
}
