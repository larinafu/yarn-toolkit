import React from "react";

import styles from "./projectSizeInputs.module.css";
import {
  getPatternSizeHeightLimited,
  getPatternSizeWidthLimited,
} from "@/utils/pixelGrid/initGridSizeUtils";
import {
  isInputAllZeros,
  isInputANumber,
  isValidProjectSize,
} from "@/utils/general/inputValidationUtils";
import { AspectRatio, PatternSize, PatternSizeInputs } from "@/types/pixelGrid";
import Image from "next/image";

const X_SIZE = 20;
const X_PADDING = 4;
const X_STROKE_WIDTH = 4;

const GRID_ICON_SIZE = 100;
const GRID_ICON_PADDING = 4;
const GRID_ICON_STROKE_WIDTH = 3;

const generateVertLinesAndNums = () => {
  const distBetweenVertLines = (GRID_ICON_SIZE - GRID_ICON_PADDING * 2) / 4;
  const linesAndNums = [];
  let curCol = 1;
  let vertLinePos = GRID_ICON_PADDING + distBetweenVertLines;
  for (
    vertLinePos;
    vertLinePos < GRID_ICON_SIZE - GRID_ICON_PADDING;
    vertLinePos += distBetweenVertLines
  ) {
    linesAndNums.push(
      <text
        key={`${linesAndNums.length}-text`}
        x={vertLinePos - distBetweenVertLines / 2}
        y={GRID_ICON_SIZE / 2}
      >
        {curCol}
      </text>
    );
    linesAndNums.push(
      <line
        key={linesAndNums.length}
        x1={vertLinePos}
        y1={GRID_ICON_PADDING}
        x2={vertLinePos}
        y2={GRID_ICON_SIZE - GRID_ICON_PADDING}
        strokeWidth={GRID_ICON_STROKE_WIDTH}
      />
    );
    curCol += 1;
  }
  linesAndNums.push(
    <text
      key={`${linesAndNums.length}-text`}
      x={vertLinePos - distBetweenVertLines / 2}
      y={GRID_ICON_SIZE / 2}
    >
      {curCol}
    </text>
  );
  return linesAndNums;
};

const generateHorizLinesAndNums = () => {
  const distBetweenHorizLines = (GRID_ICON_SIZE - GRID_ICON_PADDING * 2) / 4;
  const linesAndNums = [];
  let curRow = 1;
  let horizLinePos = GRID_ICON_PADDING + distBetweenHorizLines;
  for (
    horizLinePos;
    horizLinePos < GRID_ICON_SIZE - GRID_ICON_PADDING;
    horizLinePos += distBetweenHorizLines
  ) {
    linesAndNums.push(
      <text
        key={`${linesAndNums.length}-text`}
        y={
          horizLinePos - distBetweenHorizLines / 2 + GRID_ICON_STROKE_WIDTH / 2
        }
        x={GRID_ICON_SIZE / 2}
      >
        {curRow}
      </text>
    );
    linesAndNums.push(
      <line
        key={linesAndNums.length}
        y1={horizLinePos}
        x1={GRID_ICON_PADDING}
        y2={horizLinePos}
        x2={GRID_ICON_SIZE - GRID_ICON_PADDING}
        strokeWidth={GRID_ICON_STROKE_WIDTH}
      />
    );
    curRow += 1;
  }
  linesAndNums.push(
    <text
      key={`${linesAndNums.length}-text`}
      y={horizLinePos - distBetweenHorizLines / 2 + GRID_ICON_STROKE_WIDTH / 2}
      x={GRID_ICON_SIZE / 2}
    >
      {curRow}
    </text>
  );
  return linesAndNums;
};

export default function ProjectSizeInputs({
  patternSizeInputs,
  setPatternSizeInputs,
  widthHeightRatio,
  isGaugeChangeLoading,
  throttleContent,
  updatePatternFromSizeChange,
  setSizeChangeLoading,
  setValidForm,
  aspectRatio,
}: {
  patternSizeInputs: PatternSizeInputs;
  setPatternSizeInputs: React.Dispatch<React.SetStateAction<PatternSizeInputs>>;
  widthHeightRatio: number;
  isGaugeChangeLoading: boolean;
  updatePatternFromSizeChange: (patternSize: PatternSize) => void;
  throttleContent: React.RefObject<null | number>;
  setSizeChangeLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setValidForm: React.Dispatch<React.SetStateAction<boolean>>;
  aspectRatio?: AspectRatio;
}) {
  const isValidPatternSizeDisplay = isValidProjectSize(patternSizeInputs);

  const invalidateForm = () => {
    clearTimeout(throttleContent.current);
    setSizeChangeLoading(false);
    setValidForm(false);
  };

  const handlePatternSizeInputChange = ({
    numRows,
    numCols,
  }: {
    numRows?: string;
    numCols?: string;
  }) => {
    let newPatternSize = {
      numRows: patternSizeInputs.numRows,
      numCols: patternSizeInputs.numCols,
    };
    if (typeof numRows === "string") {
      if (numRows === "" || isInputAllZeros(numRows)) {
        newPatternSize.numRows = "";
      } else if (isInputANumber(numRows)) {
        if (aspectRatio) {
          newPatternSize = getPatternSizeHeightLimited(
            parseInt(numRows),
            widthHeightRatio,
            aspectRatio.width,
            aspectRatio.height
          );
        } else {
          newPatternSize.numRows = parseInt(numRows);
        }
      }
    } else if (typeof numCols === "string") {
      if (numCols === "" || isInputAllZeros(numCols)) {
        newPatternSize.numCols = "";
      } else if (isInputANumber(numCols)) {
        if (aspectRatio) {
          newPatternSize = getPatternSizeWidthLimited(
            parseInt(numCols),
            widthHeightRatio,
            aspectRatio.width,
            aspectRatio.height
          );
        } else {
          newPatternSize.numCols = parseInt(numCols);
        }
      }
    }
    setPatternSizeInputs(newPatternSize);
    if (isValidProjectSize(newPatternSize).isValid) {
      updatePatternFromSizeChange(newPatternSize as PatternSize);
    } else {
      invalidateForm();
    }
  };

  return (
    <>
      <h3 className="text-center h-1/6 text-lg md:text-xl">
        set your pattern size
      </h3>
      <div className={`${styles.container} h-2/3`}>
        <svg
          width={GRID_ICON_SIZE}
          height={GRID_ICON_SIZE}
          className={styles.gridContainer}
        >
          <rect
            x={GRID_ICON_PADDING}
            y={GRID_ICON_PADDING}
            width={GRID_ICON_SIZE - GRID_ICON_PADDING * 2}
            height={GRID_ICON_SIZE - GRID_ICON_PADDING * 2}
            fill="transparent"
            strokeWidth={3}
            rx={3}
            ry={3}
          ></rect>
          {generateHorizLinesAndNums()}
        </svg>
        <svg
          width={X_SIZE}
          height={X_SIZE}
          className={"stroke-amaranth m-auto"}
        >
          <line
            x1={X_PADDING}
            y1={X_PADDING}
            x2={X_SIZE - X_PADDING}
            y2={X_SIZE - X_PADDING}
            strokeWidth={X_STROKE_WIDTH}
            strokeLinecap="round"
          />
          <line
            x1={X_SIZE - X_PADDING}
            y1={X_PADDING}
            x2={X_PADDING}
            y2={X_SIZE - X_PADDING}
            strokeWidth={X_STROKE_WIDTH}
            strokeLinecap="round"
          />
        </svg>
        <svg
          width={GRID_ICON_SIZE}
          height={GRID_ICON_SIZE}
          className={styles.gridContainer}
        >
          <rect
            x={GRID_ICON_PADDING}
            y={GRID_ICON_PADDING}
            width={GRID_ICON_SIZE - GRID_ICON_PADDING * 2}
            height={GRID_ICON_SIZE - GRID_ICON_PADDING * 2}
            fill="transparent"
            strokeWidth={3}
            rx={3}
            ry={3}
          ></rect>
          {generateVertLinesAndNums()}
        </svg>
        <div className="flex flex-col items-center">
          <div className="flex h-3/4 pt-0.5">
            <button
              className="buttonBlank p-0"
              onClick={(e) => {
                e.preventDefault();
                handlePatternSizeInputChange({
                  numRows:
                    typeof patternSizeInputs.numRows === "number"
                      ? (patternSizeInputs.numRows - 1).toString()
                      : "10",
                });
              }}
            >
              <Image
                src={"/down-arrow.svg"}
                alt="down"
                width={20}
                height={20}
              />
            </button>
            <input
              type="text"
              inputMode="numeric"
              id="num_rows"
              name="num_rows"
              value={patternSizeInputs.numRows}
              onChange={(e) =>
                handlePatternSizeInputChange({ numRows: e.target.value })
              }
              disabled={isGaugeChangeLoading}
              className="max-w-10 text-center"
            />
            <button
              className="buttonBlank p-0"
              onClick={(e) => {
                e.preventDefault();
                handlePatternSizeInputChange({
                  numRows:
                    typeof patternSizeInputs.numRows === "number"
                      ? (patternSizeInputs.numRows + 1).toString()
                      : "10",
                });
              }}
            >
              <Image src={"/up-arrow.svg"} alt="up" width={20} height={20} />
            </button>
          </div>
          <label htmlFor="num_rows" className="h-1/4">
            rows
          </label>
        </div>
        <span />
        <div className="flex flex-col items-center">
          <div className="flex h-3/4 pt-0.5">
            <button
              className="buttonBlank p-0"
              onClick={(e) => {
                e.preventDefault();
                handlePatternSizeInputChange({
                  numCols:
                    typeof patternSizeInputs.numCols === "number"
                      ? (patternSizeInputs.numCols - 1).toString()
                      : "10",
                });
              }}
            >
              <Image
                src={"/down-arrow.svg"}
                alt="down"
                width={20}
                height={20}
              />
            </button>
            <input
              type="text"
              inputMode="numeric"
              id="num_cols"
              name="num_cols"
              value={patternSizeInputs.numCols}
              onChange={(e) =>
                handlePatternSizeInputChange({ numCols: e.target.value })
              }
              disabled={isGaugeChangeLoading}
              className="max-w-10 text-center"
            />
            <button
              className="buttonBlank p-0"
              onClick={(e) => {
                e.preventDefault();
                handlePatternSizeInputChange({
                  numCols:
                    typeof patternSizeInputs.numCols === "number"
                      ? (patternSizeInputs.numCols + 1).toString()
                      : "10",
                });
              }}
            >
              <Image src={"/up-arrow.svg"} alt="up" width={20} height={20} />
            </button>
          </div>
          <label htmlFor="num_cols" className="h-1/4">
            columns
          </label>
        </div>
      </div>
      {isValidPatternSizeDisplay.error && (
        <div className={`text-red-400 text-center h-1/6`}>
          <strong>
            <p>{isValidPatternSizeDisplay.error}</p>
          </strong>
        </div>
      )}
    </>
  );
}
