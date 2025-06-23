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

const cellRatioInputStyle = "w-10 aspect-square text-center mr-auto";

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
      <div className={`info-yellow p-2 text-center m-auto mb-2`}>
        <strong>This value cannot be changed later on!</strong>
      </div>
      <div className="m-auto w-fit">
        <div className={styles.cellRatioPreviewContainer}>
          <div />
          <div className="flex m-auto">
            <button
              disabled={swatchInputs.width === "1"}
              className="buttonBlank fill-amaranth"
              onClick={() =>
                handleGaugeInputChange(
                  (parseInt(swatchInputs.width) - 1).toString(),
                  swatchInputs.height
                )
              }
            >
              <Image
                src={"/down-arrow.svg"}
                alt="down"
                width={20}
                height={20}
                className="fill-amaranth"
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
              className="buttonBlank fill-amaranth"
              onClick={() =>
                handleGaugeInputChange(
                  (parseInt(swatchInputs.width) + 1).toString(),
                  swatchInputs.height
                )
              }
            >
              <Image
                src={"/up-arrow.svg"}
                alt="up"
                width={20}
                height={20}
                className="fill-amaranth"
              />
            </button>
          </div>
          <div className="flex flex-col m-auto">
            <button
              className="buttonBlank fill-amaranth"
              onClick={() =>
                handleGaugeInputChange(
                  swatchInputs.width,
                  (parseInt(swatchInputs.height) + 1).toString()
                )
              }
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
              className="buttonBlank"
              onClick={() =>
                handleGaugeInputChange(
                  swatchInputs.width,
                  (parseInt(swatchInputs.height) - 1).toString()
                )
              }
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
            className="stroke-amaranth"
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
        className={`${
          isValidSwatchDisplay.isValid ? "info-green" : "info-red"
        } p-2 text-center mt-2 ml-auto mr-auto`}
      >
        <strong>ratio: {getAspectRatio()}</strong>
        {isValidSwatchDisplay.error && <p>{isValidSwatchDisplay.error}</p>}
      </div>
    </>
  );
}
