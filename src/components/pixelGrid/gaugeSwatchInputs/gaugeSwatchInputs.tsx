import { SwatchInputs } from "@/types/pixelGrid";
import styles from "./gaugeSwatchInputs.module.css";
import {
  isInputAllZeros,
  isInputANumber,
  isValidSwatch,
} from "@/utils/general/inputValidationUtils";
import Image from "next/image";

const MARGIN = 5;
const MIN_NUM_ROWS_OR_COLS = 4;

const cellRatioInputStyle = "w-full max-w-10 text-center mr-auto text-[100%]";

export default function GaugeSwatchInputs({
  size,
  swatchInputs,
  setSwatchInputs,
  updatePatternFromGaugeChange,
  throttleContent,
  setGaugeChangeLoading,
  isSizeChangeLoading,
  setValidForm,
}: {
  size: number;
  swatchInputs: SwatchInputs;
  setSwatchInputs: React.Dispatch<React.SetStateAction<SwatchInputs>>;
  updatePatternFromGaugeChange: (width: number, height: number) => void;
  throttleContent: React.RefObject<null | number>;
  setGaugeChangeLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSizeChangeLoading: boolean;
  setValidForm: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const STROKE_WIDTH = size * 0.02;
  const BORDER_RADIUS = size * 0.01;
  const isValidSwatchDisplay = isValidSwatch(swatchInputs);

  const generateLines = () => {
    const lines = [];
    if (swatchInputs.width !== "" && swatchInputs.height !== "") {
      const prevWidthHeightRatio =
        parseInt(swatchInputs.width) / parseInt(swatchInputs.height);
      let distBetweenHorizontalLines: number;
      let distBetweenVertLines: number;
      if (prevWidthHeightRatio < 1) {
        distBetweenVertLines = size / MIN_NUM_ROWS_OR_COLS;
        distBetweenHorizontalLines =
          distBetweenVertLines * prevWidthHeightRatio;
      } else {
        distBetweenHorizontalLines = size / MIN_NUM_ROWS_OR_COLS;
        distBetweenVertLines =
          distBetweenHorizontalLines / prevWidthHeightRatio;
      }
      for (
        let vertLinePos = MARGIN + distBetweenVertLines;
        vertLinePos < MARGIN + size;
        vertLinePos += distBetweenVertLines
      ) {
        lines.push(
          <line
            key={lines.length}
            x1={vertLinePos}
            y1={MARGIN}
            x2={vertLinePos}
            y2={MARGIN + size}
            strokeWidth={STROKE_WIDTH}
          />
        );
      }
      for (
        let horizLinePos = MARGIN + distBetweenHorizontalLines;
        horizLinePos < MARGIN + size;
        horizLinePos += distBetweenHorizontalLines
      ) {
        lines.push(
          <line
            key={lines.length}
            x1={MARGIN}
            y1={horizLinePos}
            x2={MARGIN + size}
            y2={horizLinePos}
            strokeWidth={STROKE_WIDTH}
          />
        );
      }
    }
    return lines;
  };

  const invalidateForm = () => {
    clearTimeout(throttleContent.current);
    setGaugeChangeLoading(false);
    setValidForm(false);
  };

  const handleGaugeInputChange = (width: string, height: string) => {
    let newWidthInput = swatchInputs.width;
    let newHeightInput = swatchInputs.height;
    if (width === "" || isInputAllZeros(width)) {
      newWidthInput = "";
    } else if (isInputANumber(width)) {
      newWidthInput = width;
    }
    if (height === "" || isInputAllZeros(height)) {
      newHeightInput = "";
    } else if (isInputANumber(height)) {
      newHeightInput = height;
    }
    const newSwatch = { width: newWidthInput, height: newHeightInput };
    if (isValidSwatch(newSwatch).isValid) {
      updatePatternFromGaugeChange(
        parseInt(newSwatch.width),
        parseInt(newSwatch.height)
      );
    } else {
      invalidateForm();
    }
    setSwatchInputs(newSwatch);
  };

  const getAspectRatio = () =>
    `${swatchInputs.width} ÷ ${swatchInputs.height} = ${
      Math.round(
        (parseInt(swatchInputs.width) / parseInt(swatchInputs.height)) * 100
      ) / 100 || ""
    }`;
  return (
    <>
      <div className={`text-center h-3/12`}>
        <h3 className="text-center text-lg md:text-xl">set your cell size</h3>
        <strong>This value cannot be changed later on!</strong>
      </div>
      <div className="flex justify-center h-1/2">
        <div className={`${styles.cellRatioPreviewContainer} h-full`}>
          <div />
          <div className="flex mb-1 sm:justify-center">
            <button
              disabled={swatchInputs.width === "1"}
              className="buttonBlank p-0"
              onClick={(e) => {
                e.preventDefault();
                handleGaugeInputChange(
                  (parseInt(swatchInputs.width) - 1).toString(),
                  swatchInputs.height
                );
              }}
            >
              <Image
                src={"/down-arrow.svg"}
                alt="down"
                width={20}
                height={20}
                className="mr-1"
              />
            </button>
            <label>
              <input
                type="text"
                inputMode="numeric"
                id="cell_width"
                name="cell_width"
                value={swatchInputs.width}
                onChange={(e) => {
                  handleGaugeInputChange(e.target.value, swatchInputs.height);
                }}
                className={cellRatioInputStyle}
                disabled={isSizeChangeLoading}
              />
            </label>
            <button
              className="buttonBlank p-0"
              onClick={(e) => {
                e.preventDefault();
                handleGaugeInputChange(
                  (parseInt(swatchInputs.width) + 1).toString(),
                  swatchInputs.height
                );
              }}
            >
              <Image
                src={"/up-arrow.svg"}
                alt="up"
                width={20}
                height={20}
                className="ml-1"
              />
            </button>
          </div>
          <div className="flex flex-col items-center m-auto mr-1">
            <button
              className="buttonBlank p-0 size-fit"
              onClick={(e) => {
                e.preventDefault();
                handleGaugeInputChange(
                  swatchInputs.width,
                  (parseInt(swatchInputs.height) + 1).toString()
                );
              }}
            >
              <Image
                src={"/up-arrow.svg"}
                alt="up"
                width={20}
                height={20}
                className="fill-amaranth"
              />
            </button>
            <label>
              <input
                type="text"
                inputMode="numeric"
                id="cell_height"
                name="cell_height"
                value={swatchInputs.height}
                className={cellRatioInputStyle}
                onChange={(e) => {
                  handleGaugeInputChange(swatchInputs.width, e.target.value);
                }}
                disabled={isSizeChangeLoading}
              />
            </label>
            <button
              className="buttonBlank p-0 size-fit"
              onClick={(e) => {
                e.preventDefault();
                handleGaugeInputChange(
                  swatchInputs.width,
                  (parseInt(swatchInputs.height) - 1).toString()
                );
              }}
              disabled={swatchInputs.height === "1"}
            >
              <Image
                src={"/down-arrow.svg"}
                alt="down"
                width={20}
                height={20}
              />
            </button>
          </div>
          <svg
            width={size + MARGIN * 2}
            height={size + MARGIN * 2}
            viewBox={`0 0 ${size + MARGIN * 2} ${size + MARGIN * 2}`}
            className="stroke-amaranth h-full w-auto"
          >
            <rect
              x={MARGIN}
              y={MARGIN}
              width={size}
              height={size}
              fill="transparent"
              strokeWidth={STROKE_WIDTH}
              rx={BORDER_RADIUS}
              ry={BORDER_RADIUS}
            ></rect>
            {generateLines()}
          </svg>
        </div>
      </div>
      <div
        className={`h-3/12 ${
          isValidSwatchDisplay.isValid ? "info-green" : "info-red"
        } text-center ml-auto mr-auto`}
      >
        <strong>ratio: {getAspectRatio()}</strong>
        {isValidSwatchDisplay.error && <p>{isValidSwatchDisplay.error}</p>}
      </div>
    </>
  );
}
