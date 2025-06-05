import { PixelGridCanvasCellDimensions, PixelGridCanvasDimensions, PixelGridCanvasNumRowsAndCols } from "@/types/pixelGrid";
import React from "react";

const resizeCanvas = ({
  ref,
  gridWidth,
  gridHeight,
}: {
  ref: React.RefObject<HTMLCanvasElement>;
  gridWidth: number;
  gridHeight: number;
}) => {
  const dpr = window.devicePixelRatio;
  ref.current.width = gridWidth * dpr;
  ref.current.height = gridHeight * dpr;
  const ctx = ref.current.getContext("2d");
  ctx?.scale(dpr, dpr);
  ref.current.style.width = `${gridWidth}px`;
  ref.current.style.height = `${gridHeight}px`;
};

const getMaxCanvasDimensions = ({
  canvasNumRowsAndCols,
  canvasCellWidthHeightRatio,
  maxPxWidth,
  maxPxHeight,
}: {
  canvasNumRowsAndCols: PixelGridCanvasNumRowsAndCols;
  canvasCellWidthHeightRatio: number;
  maxPxWidth: number;
  maxPxHeight: number;
}): {
  gridDims: PixelGridCanvasDimensions;
  cellDims: PixelGridCanvasCellDimensions;
} => {
  // width limited
  let prvwPixelWidth = maxPxWidth / canvasNumRowsAndCols.numCols;
  let prvwPixelHeight = prvwPixelWidth * canvasCellWidthHeightRatio;
  const prvwHeight = Math.floor(prvwPixelHeight) * canvasNumRowsAndCols.numRows;
  if (prvwHeight <= maxPxHeight) {
    return {
      gridDims: {
        width: Math.floor(prvwPixelWidth) * canvasNumRowsAndCols.numCols,
        height: Math.floor(prvwPixelHeight) * canvasNumRowsAndCols.numRows,
      },
      cellDims: {
        width: Math.floor(prvwPixelWidth),
        height: Math.floor(prvwPixelHeight),
      },
    };
  }
  // height limited
  prvwPixelHeight = maxPxHeight / canvasNumRowsAndCols.numRows;
  prvwPixelWidth = prvwPixelHeight / canvasCellWidthHeightRatio;
  return {
    gridDims: {
      width: Math.floor(prvwPixelWidth) * canvasNumRowsAndCols.numCols,
      height: Math.floor(prvwPixelHeight) * canvasNumRowsAndCols.numRows,
    },
    cellDims: {
      width: Math.floor(prvwPixelWidth),
      height: Math.floor(prvwPixelHeight),
    },
  };
};

export default {
  resizeCanvas,
  getMaxCanvasDimensions,
};
