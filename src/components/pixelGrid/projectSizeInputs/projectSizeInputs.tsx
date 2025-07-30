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
import ValidationIndicator from "../validationIndicator/validationIndicator";

const X_SIZE = 20;
const X_PADDING = 4;
const X_STROKE_WIDTH = 4;

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
    <div className="flex flex-col h-full relative overflow-visible">
      <div className="flex">
        <h3 className="grow text-center text-2xl">Set your pattern size</h3>
        <ValidationIndicator errorMsg={isValidPatternSizeDisplay.error} />
      </div>
      <div className="grow flex items-center">
        <div className={`${styles.container} h-fit`}>
          <Image
            src={"/row-indicator.svg"}
            alt="The amount of rows you want in your initial knitting chart. This can be modified later"
            width={100}
            height={100}
          />
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
          <Image
            src={"/col-indicator.svg"}
            alt="The amount of columns you want in your initial knitting chart. This can be modified later"
            width={100}
            height={100}
          />
          <div className="flex flex-col items-center">
            <div className="flex pt-0.5 w-full justify-evenly">
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
                  alt="Decrease the number of rows in your chart by 1"
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
                className="size-8 sm:size-10 text-center"
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
                <Image
                  src={"/up-arrow.svg"}
                  alt="Increase the number of rows in your chart by 1"
                  width={20}
                  height={20}
                />
              </button>
            </div>
            <label htmlFor="num_rows" className="">
              rows
            </label>
          </div>
          <span />
          <div className="flex flex-col items-center">
            <div className="flex pt-0.5 w-full justify-evenly">
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
                  alt="Decrese the number of columns in your chart by 1"
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
                className="size-8 sm:size-10 text-center"
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
                <Image
                  src={"/up-arrow.svg"}
                  alt="Increase the number of columns in your chart by 1"
                  width={20}
                  height={20}
                />
              </button>
            </div>
            <label htmlFor="num_cols" className="">
              columns
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
