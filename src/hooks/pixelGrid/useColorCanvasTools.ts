import { useRef, useState } from "react";
import { PixelGridWindowTools } from "./usePixelGridWindowTools";
import {
  PixelGridCanvasCell,
  PixelGridCanvasSavedData,
} from "@/types/pixelGrid";
import { PixelGridInteractionLayerTools } from "./usePixelGridInteractionLayerTools";

export type ColorCountTracker = {
  [hex: string]: number;
};

export type ColorCanvasTools = {
  ctx: CanvasRenderingContext2D | null;
  setCtx: React.Dispatch<React.SetStateAction<CanvasRenderingContext2D | null>>;
  ref: React.RefObject<HTMLCanvasElement | null>;
  colorCountTracker: ColorCountTracker;
  updatePixelColor: ({
    row,
    col,
    hex,
    ctx,
  }: {
    row: number;
    col: number;
    hex: string;
    ctx?: CanvasRenderingContext2D;
    windowTools?: PixelGridWindowTools;
  }) => void;
  updatePixelOnInitialRender: (
    row: number,
    col: number,
    hex: string,
    ctx: CanvasRenderingContext2D
  ) => void;
};

export default function usePixelGridColorCanvasTools({
  canvasWindowTools,
  savedCanvasDataRef,
  interactionLayerTools,
}: {
  canvasWindowTools: PixelGridWindowTools;
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  interactionLayerTools: PixelGridInteractionLayerTools;
}): ColorCanvasTools {
  const colorCanvasRef = useRef(null);
  const [colorCanvasContext, setColorCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const [colorCountTracker, setColorCountTracker] = useState<{
    [hex: string]: number;
  }>(
    (() => {
      const counter: { [key: string]: number } = {};
      iterateOverMatrixObj(
        savedCanvasDataRef.current.pixels,
        ({ data }: { data: PixelGridCanvasCell }) => {
          counter[data.hex] ??= 0;
          counter[data.hex] += 1;
        }
      );
      return counter;
    })()
  );

  const updatePixelColor = ({
    row,
    col,
    hex,
    ctx,
    windowTools,
  }: {
    row: number;
    col: number;
    hex: string;
    ctx?: CanvasRenderingContext2D;
    windowTools?: PixelGridWindowTools;
  }) => {
    const context = (ctx as CanvasRenderingContext2D) || colorCanvasContext;
    const curCanvasWindowTools = windowTools || canvasWindowTools;
    const [rowPos, colPos] = [
      interactionLayerTools.getRowPos(row, curCanvasWindowTools.canvasWindow),
      interactionLayerTools.getColPos(col, curCanvasWindowTools.canvasWindow),
    ];
    context.fillStyle = hex;
    context.fillRect(
      colPos * curCanvasWindowTools.canvasCellDimensions.width,
      rowPos * curCanvasWindowTools.canvasCellDimensions.height,
      curCanvasWindowTools.canvasCellDimensions.width,
      curCanvasWindowTools.canvasCellDimensions.height
    );
  };

  return {
    ctx: colorCanvasContext,
    setCtx: setColorCanvasContext,
    ref: colorCanvasRef,
    colorCountTracker,
    updatePixelColor,
    updatePixelOnInitialRender: (
      row: number,
      col: number,
      hex: string,
      ctx: CanvasRenderingContext2D
    ) => {
      updatePixelColor({ row, col, hex, ctx });
    },
  };
}

const iterateOverMatrixObj = <T>(
  matrixObj: any[][] | { [row: number]: { [col: number]: T } },
  callback: ({ row, col, data }: { row: number; col: number; data: T }) => void
) => {
  for (const row in matrixObj) {
    for (const col in matrixObj[row]) {
      callback({
        row: parseInt(row),
        col: parseInt(col),
        data: matrixObj[row][col],
      });
    }
  }
};
