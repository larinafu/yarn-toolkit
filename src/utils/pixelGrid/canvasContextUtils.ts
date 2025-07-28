import canvasSizingUtils from "./canvasSizingUtils";
import React from "react";
import {
  isSvgPath,
  PixelGridCanvasCell,
  PixelGridCanvasCellDimensions,
  PixelGridCanvasDimensions,
  PixelGridCanvasNumRowsAndCols,
  PixelGridCanvasSavedData,
  PixelGridNumberFormatGuide,
  SvgPath,
  SvgPaths,
} from "@/types/pixelGrid";
import { numberFormatGuides } from "@/constants/pixelGrid/numberFormatGuides";
import {
  KNITTING_STITCHES,
  KNITTING_CABLE_STITCHES,
} from "@/constants/pixelGrid/stitches";
import { SpecialShape } from "@/hooks/pixelGrid/usePixelGridSpecialShapesCanvasTools";
import { getStitchWidthUnitsFromId, isCable } from "../general/stitchUtils";

const drawGridLines = ({
  cellDimensions,
  gridDimensions,
  lineThickness,
  lineColor,
  noErase,
  offset,
  ctx,
}: {
  cellDimensions: PixelGridCanvasCellDimensions;
  gridDimensions: PixelGridCanvasDimensions;
  lineThickness?: number;
  lineColor?: string;
  noErase?: boolean;
  offset?: PixelGridCanvasDimensions;
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
}) => {
  const curOffset = {
    width: 0,
    height: 0,
    ...offset,
  };
  if (!noErase) {
    ctx.clearRect(0, 0, gridDimensions.width, gridDimensions.height);
  }
  ctx.beginPath();
  ctx.lineWidth = lineThickness || 2;
  ctx.strokeStyle = lineColor || "#000";
  // horizontal
  for (let x = 0; x <= gridDimensions.width; x += cellDimensions.width) {
    ctx.moveTo(x + curOffset.width, 0 + curOffset.height);
    ctx.lineTo(x + curOffset.width, gridDimensions.height + curOffset.height);
  }

  // vertical
  for (let y = 0; y <= gridDimensions.height; y += cellDimensions.height) {
    ctx.moveTo(0 + curOffset.width, y + curOffset.height);
    ctx.lineTo(gridDimensions.width + curOffset.width, y + curOffset.height);
  }
  ctx.stroke();
};

const drawColoredSquare = ({
  x,
  y,
  w,
  h,
  color,
  ctx,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
}) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
};

const drawStitchPath = (
  x: number,
  y: number,
  w: number,
  h: number,
  svgPathStep: SvgPath,
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
) => {
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  if (svgPathStep[1] === "stroke") {
    ctx.stroke(createFromSvgPath(x, y, w, h, svgPathStep[0]));
  } else {
    ctx.fill(createFromSvgPath(x, y, w, h, svgPathStep[0]));
  }
};

const drawPixelGridColors = ({
  colorCtx,
  cellDims,
  cells,
  offset,
}: {
  colorCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  cellDims: PixelGridCanvasCellDimensions;
  cells: PixelGridCanvasCell[][];
  offset?: PixelGridCanvasDimensions;
}) => {
  const curOffset = {
    width: 0,
    height: 0,
    ...offset,
  };
  const numRowsAndCols: PixelGridCanvasNumRowsAndCols = {
    numRows: cells.length,
    numCols: cells[0].length,
  };
  for (let row = 0; row < numRowsAndCols.numRows; row++) {
    for (let col = 0; col < numRowsAndCols.numCols; col++) {
      drawColoredSquare({
        x: col * cellDims.width + curOffset.width,
        y: row * cellDims.height + curOffset.height,
        w: cellDims.width,
        h: cellDims.height,
        color: cells[row][col].hex,
        ctx: colorCtx,
      });
    }
  }
};

const drawPixelGridStitches = ({
  stitchCtx,
  cellDims,
  cells,
  offset,
  gridLineColor,
  noErase,
}: {
  stitchCtx: CanvasRenderingContext2D;
  cellDims: PixelGridCanvasCellDimensions;
  cells: PixelGridCanvasCell[][];
  offset?: PixelGridCanvasDimensions;
  gridLineColor?: string;
  noErase?: boolean;
}) => {
  const curOffset = {
    width: 0,
    height: 0,
    ...offset,
  };
  const numRowsAndCols: PixelGridCanvasNumRowsAndCols = {
    numRows: cells.length,
    numCols: cells[0].length,
  };
  for (let row = 0; row < numRowsAndCols.numRows; row++) {
    for (let col = 0; col < numRowsAndCols.numCols; col++) {
      const stitch = cells[row][col].stitch;
      if (stitch) {
        if (isCable(stitch)) {
          drawCableStitch({
            x: col * cellDims.width + curOffset.width,
            y: row * cellDims.height + curOffset.height,
            cellW: cellDims.width,
            cellH: cellDims.height,
            stitch,
            ctx: stitchCtx,
            gridLineColor,
          });
        } else {
          stitchCtx.strokeStyle = cells[row][col].stitchColor || "#000";
          stitchCtx.fillStyle = cells[row][col].stitchColor || "#000";
          const svgPathSteps = (
            KNITTING_STITCHES[stitch] || KNITTING_CABLE_STITCHES[stitch]
          ).svgPaths;
          if (isSvgPath(svgPathSteps)) {
            drawStitchPath(
              col * cellDims.width + curOffset.width,
              row * cellDims.height + curOffset.height,
              cellDims.width,
              cellDims.height,
              svgPathSteps,
              stitchCtx
            );
          } else {
            for (const svgPathStep of svgPathSteps) {
              drawStitchPath(
                col * cellDims.width + curOffset.width,
                row * cellDims.height + curOffset.height,
                cellDims.width,
                cellDims.height,
                svgPathStep,
                stitchCtx
              );
            }
          }
        }
      }
    }
  }
};

const drawPixelGridColorsAndStitches = ({
  colorCtx,
  stitchCtx,
  cellDims,
  gridDims,
  cells,
  offset,
}: {
  colorCtx: CanvasRenderingContext2D;
  stitchCtx: CanvasRenderingContext2D;
  cellDims: PixelGridCanvasCellDimensions;
  gridDims: PixelGridCanvasDimensions;
  cells: PixelGridCanvasCell[][];
  offset?: PixelGridCanvasDimensions;
}) => {
  const curOffset = {
    width: 0,
    height: 0,
    ...offset,
  };
  const numRowsAndCols: PixelGridCanvasNumRowsAndCols = {
    numRows: cells.length,
    numCols: cells[0].length,
  };
  for (let row = 0; row < numRowsAndCols.numRows; row++) {
    for (let col = 0; col < numRowsAndCols.numCols; col++) {
      if (!cells[row][col].isPartOfCable) {
        drawColoredSquare({
          x: col * cellDims.width + curOffset.width,
          y: row * cellDims.height + curOffset.height,
          w: cellDims.width,
          h: cellDims.height,
          color: cells[row][col].hex,
          ctx: colorCtx,
        });
      }
      const stitch = cells[row][col].stitch;
      if (stitch) {
        if (isCable(stitch)) {
          drawCableStitch({
            x: col * cellDims.width + curOffset.width,
            y: row * cellDims.height + curOffset.height,
            cellW: cellDims.width,
            cellH: cellDims.height,
            stitch,
            ctx: stitchCtx,
          });
        } else {
          stitchCtx.strokeStyle = cells[row][col].stitchColor || "#000";
          stitchCtx.fillStyle = cells[row][col].stitchColor || "#000";
          const svgPathSteps = (
            KNITTING_STITCHES[stitch] || KNITTING_CABLE_STITCHES[stitch]
          ).svgPaths;
          if (isSvgPath(svgPathSteps)) {
            drawStitchPath(
              col * cellDims.width + curOffset.width,
              row * cellDims.height + curOffset.height,
              cellDims.width,
              cellDims.height,
              svgPathSteps,
              stitchCtx
            );
          } else {
            for (const svgPathStep of svgPathSteps) {
              drawStitchPath(
                col * cellDims.width + curOffset.width,
                row * cellDims.height + curOffset.height,
                cellDims.width,
                cellDims.height,
                svgPathStep,
                stitchCtx
              );
            }
          }
        }
      }
    }
  }
};

const drawSpecialShapes = ({
  specialShapesCtx,
  specialShapes,
  cellDims,
  gridDims,
  offset,
}: {
  specialShapesCtx:
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D;
  specialShapes: SpecialShape[];
  cellDims: PixelGridCanvasCellDimensions;
  gridDims?: PixelGridCanvasDimensions;
  offset?: PixelGridCanvasDimensions;
}) => {
  const curOffset = {
    width: 0,
    height: 0,
    ...offset,
  };
  gridDims && specialShapesCtx.clearRect(0, 0, gridDims.width, gridDims.height);
  specialShapesCtx.lineWidth = 5;
  specialShapesCtx.lineCap = "round";
  for (const shape of specialShapes) {
    specialShapesCtx.strokeStyle = shape.color;
    const linePath = [];
    for (const point of shape.points) {
      linePath.push(
        `${linePath.length ? "L" : "M"} ${
          point.col * cellDims.width + curOffset.width
        } ${point.row * cellDims.height + curOffset.height}`
      );
    }
    specialShapesCtx.stroke(new Path2D(linePath.join(" ")));
  }
};

const drawGridNumbers = ({
  ctx,
  cellDims,
  numRowsAndCols,
  numberFormatGuide,
  offset,
}: {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  cellDims: PixelGridCanvasCellDimensions;
  numRowsAndCols: PixelGridCanvasNumRowsAndCols;
  numberFormatGuide: PixelGridNumberFormatGuide;
  offset?: PixelGridCanvasDimensions;
}) => {
  const curOffset = {
    width: 0,
    height: 0,
    ...offset,
  };
  ctx.font = `${cellDims.height * 0.7}px sans-serif`;
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";

  let rowStart: number, rowEnd: number, colStart: number, colEnd: number;

  // if (numberFormatGuide.numbersReversed) {
  colStart = numRowsAndCols.numCols;
  colEnd = 1;
  rowStart = 1 + (numRowsAndCols.numRows - 1) * numberFormatGuide.stepCount;
  rowEnd = 1;
  // }

  const findNumPos = (num: number, start: number, diff: number) =>
    (num - start) / diff + 1;

  const shouldShowNum = (
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
    let colNum = colStart;
    colNum >= colEnd;
    numberFormatGuide.numbersReversed ? colNum-- : colNum++
  ) {
    if (shouldShowNum(colNum, "top")) {
      ctx.textBaseline = "bottom";
      // horizontal - top
      ctx.fillText(
        colNum.toString(),
        findNumPos(
          colNum + 1,
          colStart,
          numberFormatGuide.numbersReversed ? -1 : 1
        ) *
          cellDims.width +
          cellDims.width / 2 +
          curOffset.width,
        curOffset.height - 1,
        cellDims.width
      );
    }

    if (shouldShowNum(colNum, "bottom")) {
      ctx.textBaseline = "top";
      // horizontal - bottom
      ctx.fillText(
        colNum.toString(),
        findNumPos(
          colNum + 1,
          colStart,
          numberFormatGuide.numbersReversed ? -1 : 1
        ) *
          cellDims.width +
          cellDims.width / 2 +
          curOffset.width,
        curOffset.height + numRowsAndCols.numRows * cellDims.height + 1,
        cellDims.width
      );
    }
  }

  ctx.textBaseline = "middle";

  for (
    let rowNum = rowStart;
    rowNum >= rowEnd;
    rowNum =
      rowNum +
      numberFormatGuide.stepCount * (numberFormatGuide.numbersReversed ? -1 : 1)
  ) {
    if (shouldShowNum(rowNum, "left")) {
      ctx.textAlign = "right";
      // vertical - left
      ctx.fillText(
        rowNum.toString(),
        curOffset.width - 3,
        findNumPos(
          rowNum + 1,
          rowStart,
          numberFormatGuide.stepCount *
            (numberFormatGuide.numbersReversed ? -1 : 1)
        ) *
          cellDims.height +
          cellDims.height / 2 +
          curOffset.height,
        curOffset.width
      );
    }

    if (shouldShowNum(rowNum, "right")) {
      // vertical - right
      ctx.textAlign = "left";
      ctx.fillText(
        rowNum.toString(),
        curOffset.width + numRowsAndCols.numCols * cellDims.width + 3,
        findNumPos(
          rowNum + numberFormatGuide.stepCount,
          rowStart,
          numberFormatGuide.stepCount *
            (numberFormatGuide.numbersReversed ? -1 : 1)
        ) *
          cellDims.height +
          cellDims.height / 2 +
          curOffset.height,
        curOffset.width
      );
    }
  }
};

const drawFullCanvasPreview = ({
  maxPxWidth,
  maxPxHeight,
  savedCanvasData,
  specialShapes,
  gridLineColor,
  ref,
  ctx,
  includeWatermark,
}: {
  maxPxWidth: number;
  maxPxHeight: number;
  savedCanvasData: PixelGridCanvasSavedData;
  specialShapes: SpecialShape[];
  ref: React.RefObject<any>;
  ctx: CanvasRenderingContext2D;
  gridLineColor?: string;
  includeWatermark?: boolean;
}) => {
  const offset = {
    width: Math.round(maxPxWidth * 0.05),
    height: Math.round(maxPxHeight * 0.05),
  };
  const numRowsAndCols: PixelGridCanvasNumRowsAndCols = {
    numRows: savedCanvasData.pixels.length,
    numCols: savedCanvasData.pixels[0].length,
  };
  const { cellDims, gridDims } = canvasSizingUtils.getMaxCanvasDimensions({
    canvasNumRowsAndCols: numRowsAndCols,
    canvasCellWidthHeightRatio:
      savedCanvasData.swatch.width / savedCanvasData.swatch.height,
    maxPxWidth: maxPxWidth - offset.width * 2,
    maxPxHeight: maxPxHeight - offset.height * 2,
  });
  ref &&
    canvasSizingUtils.resizeCanvas({
      ref,
      gridWidth: gridDims.width + offset.width * 2,
      gridHeight: gridDims.height + offset.height * 2,
    });

  drawPixelGridColors({
    colorCtx: ctx,
    cellDims,
    cells: savedCanvasData.pixels,
    offset,
  });
  drawGridLines({
    cellDimensions: cellDims,
    gridDimensions: gridDims,
    noErase: true,
    offset,
    ctx,
    lineColor: gridLineColor,
  });
  drawPixelGridStitches({
    stitchCtx: ctx,
    cellDims,
    cells: savedCanvasData.pixels,
    offset,
    gridLineColor,
  });
  drawGridNumbers({
    ctx,
    cellDims,
    numRowsAndCols: numRowsAndCols,
    numberFormatGuide: numberFormatGuides[savedCanvasData.numberFormat],
    offset,
  });
  drawSpecialShapes({
    specialShapes,
    cellDims,
    offset,
    specialShapesCtx: ctx,
  });
  if (includeWatermark) {
    const text = "generated by yarntoolkit.com";
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    // Draw white background rectangle
    ctx.fillStyle = "#FFF";
    ctx.fillRect(
      gridDims.width + offset.width - textWidth - 3,
      gridDims.height + offset.height - textHeight - 3,
      textWidth,
      textHeight
    );
    // Draw the text
    ctx.fillStyle = "#000";
    ctx.lineWidth = 1;
    ctx.fillText(
      text,
      gridDims.width + offset.width - 3,
      gridDims.height + offset.height - 3
    );
  }
};

export const drawCableStitch = ({
  x,
  y,
  cellW,
  cellH,
  stitch,
  ctx,
  gridLineColor,
}: {
  x: number;
  y: number;
  cellW: number;
  cellH: number;
  stitch: string;
  ctx: CanvasRenderingContext2D;
  gridLineColor?: string;
}) => {
  const stitchWidthUnit = getStitchWidthUnitsFromId(stitch);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, cellW * stitchWidthUnit, cellH);
  ctx.clip();
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, cellW * stitchWidthUnit, cellH);
  ctx.strokeRect(x, y, cellW * stitchWidthUnit, cellH);
  const svgPaths = KNITTING_CABLE_STITCHES[stitch].svgPaths;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  for (const svgPath of svgPaths) {
    ctx.fillStyle = svgPath[1];
    const path = createSvgPathFromCable(x, y, cellW, cellH, svgPath[0]);
    ctx.fill(path);
    ctx.stroke(path);
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = gridLineColor || "#000";
  ctx.strokeRect(x, y, cellW * stitchWidthUnit, cellH);
  ctx.restore();
};

const createSvgPathFromCable = (
  x: number,
  y: number,
  w: number,
  h: number,
  d: string
) => {
  const path = new Path2D();
  const mat = new DOMMatrix();
  mat.translateSelf(x + w / 100, y + h / 100);
  mat.scaleSelf(w / 100, h / 100, 1);
  path.addPath(new Path2D(d), mat);
  return path;
};

export const createFromSvgPath = (
  x: number,
  y: number,
  width: number,
  height: number,
  d: string
) => {
  const path = new Path2D();
  const mat = new DOMMatrix();
  mat.translateSelf(x + width * 0.1, y + height * 0.1);
  mat.scaleSelf((width / 100) * 0.8, (height / 100) * 0.8, 1);
  path.addPath(new Path2D(d), mat);
  return path;
};

export default {
  drawGridLines,
  drawPixelGridColors,
  drawPixelGridColorsAndStitches,
  drawGridNumbers,
  drawFullCanvasPreview,
  drawSpecialShapes,
  drawCableStitch,
  createFromSvgPath,
  drawPixelGridStitches,
  numberFormatGuides,
};
