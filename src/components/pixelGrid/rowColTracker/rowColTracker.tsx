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
import { GridSizingTools } from "@/hooks/pixelGrid/usePixelGridSizingTools";

const TrackerOptions = ({
  pos,
  loc,
  number,
  gridSizingTools,
  layerIdx,
}: {
  pos: "top" | "bottom" | "left" | "right";
  loc: "top" | "bottom" | "left" | "right";
  number: number;
  gridSizingTools: GridSizingTools;
  layerIdx: number;
}) => {
  const [isOpen, setOpen] = useState(false);
  const ref = useRefWithClickawayListener(() => {
    setOpen(false);
  }, []);
  let positioning: string;
  let type: "row" | "column";
  switch (pos) {
    case "top":
      positioning = `top-full ${loc === "left" ? "left-0" : "right-0"}`;
      type = "column";
      break;
    case "bottom":
      positioning = `bottom-full ${loc === "left" ? "left-0" : "right-0"}`;
      type = "column";
      break;
    case "left":
      positioning = `left-full ${loc === "top" ? "top-0" : "bottom-0"}`;
      type = "row";
      break;
    case "right":
      positioning = `right-full ${loc === "top" ? "top-0" : "bottom-0"}`;
      type = "row";
  }

  const options = [
    {
      text: `Insert ${type} ${type === "row" ? "above" : "left"}`,
      onClick: () => {
        if (type === "row") {
          gridSizingTools.addRow(layerIdx, "top");
        } else {
          gridSizingTools.addCol(layerIdx, "left");
        }
      },
    },
    {
      text: `Insert ${type} ${type === "row" ? "below" : "right"}`,
      onClick: () => {
        if (type === "row") {
          gridSizingTools.addRow(layerIdx, "bottom");
        } else {
          gridSizingTools.addCol(layerIdx, "right");
        }
      },
    },
    {
      text: `Delete ${type}`,
      onClick: () => {
        if (type === "row") {
          gridSizingTools.deleteRow(layerIdx);
        } else {
          gridSizingTools.deleteCol(layerIdx);
        }
      },
    },
  ];
  return (
    <div ref={ref} className="relative">
      <button
        className={`buttonBlank text-black m-0 p-0 ${
          isOpen ? "bg-amaranth-light" : ""
        }`}
        onClick={() => setOpen(!isOpen)}
      >
        {number}
      </button>
      {isOpen && (
        <ul
          className={`z-10 w-fit card absolute m-1 fadeInFast p-0 ${positioning}`}
        >
          {options.map((option, idx) => (
            <li
              className="whitespace-nowrap hover:bg-gray-200 first:rounded-t-md last:rounded-b-md"
              key={idx}
            >
              <button
                className="text-start buttonBlank text-black m-0 p-0.5 border-0 w-full h-full"
                onClick={option.onClick}
              >
                {option.text}
              </button>
            </li>
          ))}
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
  gridSizingTools,
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
  gridSizingTools: GridSizingTools;
}) {
  const topLabels = [];
  const bottomLabels = [];
  const leftLabels = [];
  const rightLabels = [];

  let colStart: number, colEnd: number;
  const numberFormatGuide: PixelGridNumberFormatGuide =
    numberFormatGuides[numberFormat];

  //   if (numberFormatGuide.numbersReversed) {
  colStart = canvasNumRowsAndCols.numCols - canvasWindow.startCol;
  colEnd =
    canvasNumRowsAndCols.numCols -
    canvasWindow.visibleCols -
    canvasWindow.startCol;

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

  const getDisplayNum = (idx: number) => {
    return (
      numberFormatGuide.stepCount *
        (canvasNumRowsAndCols.numRows - (idx + canvasWindow.startRow)) +
      (1 - numberFormatGuide.stepCount)
    );
  };
  for (
    let rowStartIdx = 0;
    rowStartIdx < canvasWindow.visibleRows;
    rowStartIdx += 1
  ) {
    const displayRowNum = getDisplayNum(rowStartIdx);
    leftLabels.push(
      <div
        className="flex items-center justify-end pr-0.5"
        style={{
          height: canvasCellDimensions.height,
          opacity: getOpacity(displayRowNum, "left"),
        }}
      >
        <TrackerOptions
          pos="left"
          number={displayRowNum}
          loc={rowStartIdx > canvasWindow.visibleRows / 2 ? "bottom" : "top"}
          gridSizingTools={gridSizingTools}
          layerIdx={rowStartIdx + canvasWindow.startRow}
        />
      </div>
    );
    rightLabels.push(
      <div
        className="flex items-center justify-start pl-0.5"
        style={{
          height: canvasCellDimensions.height,
          opacity: getOpacity(displayRowNum, "right"),
        }}
      >
        <TrackerOptions
          pos="right"
          number={displayRowNum}
          loc={rowStartIdx > canvasWindow.visibleRows / 2 ? "bottom" : "top"}
          gridSizingTools={gridSizingTools}
          layerIdx={rowStartIdx + canvasWindow.startRow}
        />
      </div>
    );
  }

  for (
    let colStartIdx = 0;
    colStartIdx < canvasWindow.visibleCols;
    colStartIdx += 1
  ) {
    const displayColNum =
      canvasNumRowsAndCols.numCols - (colStartIdx + canvasWindow.startCol);
    topLabels.push(
      <div
        className="flex justify-center items-end"
        style={{
          width: canvasCellDimensions.width,
          opacity: getOpacity(displayColNum, "top"),
        }}
      >
        <TrackerOptions
          pos="top"
          number={displayColNum}
          loc={colStartIdx > canvasWindow.visibleCols / 2 ? "right" : "left"}
          gridSizingTools={gridSizingTools}
          layerIdx={colStartIdx + canvasWindow.startCol}
        />
      </div>
    );
    bottomLabels.push(
      <div
        className="flex items-start justify-center"
        style={{
          width: canvasCellDimensions.width,
          opacity: getOpacity(displayColNum, "bottom"),
        }}
      >
        <TrackerOptions
          pos="bottom"
          number={displayColNum}
          loc={colStartIdx > canvasWindow.visibleCols / 2 ? "right" : "left"}
          gridSizingTools={gridSizingTools}
          layerIdx={colStartIdx + canvasWindow.startCol}
        />
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
