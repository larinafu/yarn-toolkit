import {
  PixelGridCanvasDimensions,
  PixelGridCanvasNumRowsAndCols,
  PixelGridCanvasWindow,
  PixelGridNumberFormat,
  PixelGridNumberFormatGuide,
} from "@/types/pixelGrid";
import { numberFormatGuides } from "@/constants/pixelGrid/numberFormatGuides";

import styles from "./rowColTracker.module.css";
import { useRefWithClickawayListener } from "@/hooks/general/useRefWithClickawayListener";
import { useState } from "react";

const TrackerOptions = ({
  pos,
  number,
}: {
  pos: "top" | "bottom" | "left" | "right";
  number: number;
}) => {
  const [isOpen, setOpen] = useState(false);
  const ref = useRefWithClickawayListener(() => {
    setOpen(false);
  }, []);
  let positioning: string;
  let type: "row" | "column";
  switch (pos) {
    case "top":
      positioning = "top-full left-0";
      type = "column";
      break;
    case "bottom":
      positioning = "bottom-full left-0";
      type = "column";
      break;
    case "left":
      positioning = "left-full top-0";
      type = "row";
      break;
    case "right":
      positioning = "right-full top-0";
      type = "row";
  }
  return (
    <div ref={ref} className="relative">
      <button
        className="buttonBlank text-black m-0 p-0"
        onClick={() => setOpen(!isOpen)}
      >
        {number}
      </button>
      {isOpen && (
        <ul className={`z-10 card absolute ${positioning}`}>
          <li>
            Insert {type} {type === "row" ? "above" : "left"}
          </li>
          <li>
            Insert {type} {type === "row" ? "below" : "right"}
          </li>
        </ul>
      )}
    </div>
  );
};

export default function RowColTracker({
  children,
  canvasWindow,
  canvasCellDimensions,
  canvasNumRowsAndCols,
  numberFormat,
  pixelGridCanvasRefWithRect,
}: {
  children: React.ReactNode;
  canvasWindow: PixelGridCanvasWindow;
  canvasCellDimensions: PixelGridCanvasDimensions;
  canvasNumRowsAndCols: PixelGridCanvasNumRowsAndCols;
  numberFormat: PixelGridNumberFormat;
  pixelGridCanvasRefWithRect: {
    ref: React.RefObject<any>;
    getDims: () => DOMRect | undefined;
  };
}) {
  const topLabels = [];
  const bottomLabels = [];
  const leftLabels = [];
  const rightLabels = [];

  let rowStart: number, rowEnd: number, colStart: number, colEnd: number;
  const numberFormatGuide: PixelGridNumberFormatGuide =
    numberFormatGuides[numberFormat];

  //   if (numberFormatGuide.numbersReversed) {
  colStart = canvasNumRowsAndCols.numCols - canvasWindow.startCol;
  colEnd =
    canvasNumRowsAndCols.numCols -
    canvasWindow.visibleCols -
    canvasWindow.startCol;
  rowStart = canvasNumRowsAndCols.numRows - canvasWindow.startRow;
  rowStart = 1 + (rowStart - 1) * numberFormatGuide.stepCount;
  rowEnd =
    canvasNumRowsAndCols.numRows -
    canvasWindow.visibleRows -
    canvasWindow.startRow;
  rowEnd = 1 + (rowEnd - 1) * numberFormatGuide.stepCount;
  //   }

  const getOpacity = (
    num: number,
    side: keyof Omit<
      PixelGridNumberFormatGuide,
      "numbersReversed" | "stepCount"
    >
  ) => {
    switch (numberFormatGuide[side].visible) {
      case "all":
        return 1;
      case "even":
        return num % 2 === 0 ? 1 : 0;
      case "none":
        return 0;
      case "odd":
        return num % 2 === 0 ? 0 : 1;
    }
  };

  for (
    let rowNum = rowStart;
    rowNum > rowEnd;
    rowNum =
      rowNum +
      numberFormatGuide.stepCount * (numberFormatGuide.numbersReversed ? -1 : 1)
  ) {
    leftLabels.push(
      <div
        className="flex items-center justify-end pr-0.5"
        style={{
          height: canvasCellDimensions.height,
          opacity: getOpacity(rowNum, "left"),
        }}
      >
        <TrackerOptions pos="left" number={rowNum} />
      </div>
    );
    rightLabels.push(
      <div
        className="flex items-center justify-start pl-0.5"
        style={{
          height: canvasCellDimensions.height,
          opacity: getOpacity(rowNum, "right"),
        }}
      >
        <TrackerOptions pos="right" number={rowNum} />
      </div>
    );
  }

  for (
    let colNum = colStart;
    colNum > colEnd;
    numberFormatGuide.numbersReversed ? colNum-- : colNum++
  ) {
    topLabels.push(
      <div
        className="flex justify-center items-end"
        style={{
          width: canvasCellDimensions.width,
          opacity: getOpacity(colNum, "top"),
        }}
      >
        <TrackerOptions pos="top" number={colNum} />
      </div>
    );
    bottomLabels.push(
      <div
        className="flex items-start justify-center"
        style={{
          width: canvasCellDimensions.width,
          opacity: getOpacity(colNum, "bottom"),
        }}
      >
        <TrackerOptions pos="bottom" number={colNum} />
      </div>
    );
  }

  return (
    <div className="relative size-full">
      <div
        className={`absolute top-0 left-0 grid grid-cols-3 grid-rows-3 gap-0 w-full h-full ${styles.wrapper}`}
      >
        <div
          className={`${styles.content}`}
          ref={pixelGridCanvasRefWithRect.ref}
        >
          {/* {children} */}
        </div>
        <div className={styles.leftLabels}>
          <section className="w-10"></section>
        </div>
        <div className={styles.bottomLabels}>
          <section className="flex h-10"></section>
        </div>
        <div className={styles.rightLabels}>
          <section className="w-10"></section>
        </div>
        <div className={styles.topLabels}>
          <section className="flex h-10"></section>
        </div>
      </div>

      <div
        className={`absolute top-0 left-0 grid grid-cols-3 grid-rows-3 gap-0 ${styles.wrapper}`}
      >
        <div className={`${styles.content} touch-none relative`}>
          {children}
        </div>
        <div className={styles.leftLabels}>
          <section className="w-10">{...leftLabels}</section>
        </div>
        <div className={styles.bottomLabels}>
          <section className="flex h-10">{...bottomLabels}</section>
        </div>
        <div className={styles.rightLabels}>
          <section className="w-10">{...rightLabels}</section>
        </div>
        <div className={styles.topLabels}>
          <section className="flex h-10">{...topLabels}</section>
        </div>
      </div>
    </div>
  );
}
