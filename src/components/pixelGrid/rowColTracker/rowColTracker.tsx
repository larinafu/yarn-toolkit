import {
  PixelGridCanvasDimensions,
  PixelGridCanvasNumRowsAndCols,
  PixelGridCanvasWindow,
  PixelGridNumberFormat,
  PixelGridNumberFormatGuide,
} from "@/types/pixelGrid";
import { numberFormatGuides } from "@/constants/pixelGrid/numberFormatGuides";

export default function RowColTracker({
  children,
  canvasWindow,
  canvasCellDimensions,
  canvasNumRowsAndCols,
  numberFormat,
}: {
  children: React.ReactNode;
  canvasWindow: PixelGridCanvasWindow;
  canvasCellDimensions: PixelGridCanvasDimensions;
  canvasNumRowsAndCols: PixelGridCanvasNumRowsAndCols;
  numberFormat: PixelGridNumberFormat;
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
        className="flex items-center justify-center"
        style={{
          height: canvasCellDimensions.height,
          width: 10,
          opacity: getOpacity(rowNum, "left"),
        }}
      >
        {rowNum}
      </div>
    );
    rightLabels.push(
      <div
        className="flex items-center justify-center"
        style={{
          height: canvasCellDimensions.height,
          width: 10,
          opacity: getOpacity(rowNum, "right"),
        }}
      >
        {rowNum}
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
        className="flex items-center justify-center"
        style={{
          width: canvasCellDimensions.width,
          opacity: getOpacity(colNum, "top"),
        }}
      >
        {colNum}
      </div>
    );
    bottomLabels.push(
      <div
        className="flex items-center justify-center"
        style={{
          width: canvasCellDimensions.width,
          opacity: getOpacity(colNum, "bottom"),
        }}
      >
        {colNum}
      </div>
    );
  }

  return (
    <section className="flex items-center w-fit m-auto mt-0 mb-0">
      <section className="m-2">{...leftLabels}</section>
      <div className="flex flex-col w-fit m-auto mt-0 mb-0">
        <section className="flex">{...topLabels}</section>
        {children}
        <section className="flex">{...bottomLabels}</section>
      </div>
      <section className="m-2">{...rightLabels}</section>
    </section>
  );
}
