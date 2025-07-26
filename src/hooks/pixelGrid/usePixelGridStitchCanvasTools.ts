import React, { useRef, useState } from "react";
import { PixelGridWindowTools } from "./usePixelGridWindowTools";
import { PixelGridInteractionLayerTools } from "./usePixelGridInteractionLayerTools";
import {
  isSvgPath,
  PixelGridCanvasSavedData,
  SvgPath,
} from "@/types/pixelGrid";
import {
  KNITTING_CABLE_STITCHES,
  KNITTING_STITCHES,
} from "@/constants/pixelGrid/stitches";
import { getCableStitchWidthUnits, isCable } from "@/utils/general/stitchUtils";

export type StitchCanvasTools = {
  ctx: CanvasRenderingContext2D | null;
  setCtx: React.Dispatch<React.SetStateAction<CanvasRenderingContext2D | null>>;
  ref: React.RefObject<HTMLCanvasElement | null>;
  updateStitch: ({
    row,
    col,
    stitch,
    color,
    ctx,
    windowTools,
  }: {
    row: number;
    col: number;
    stitch: string;
    color: string;
    ctx?: CanvasRenderingContext2D;
    windowTools?: Partial<PixelGridWindowTools>;
  }) => void;
  findCableStitchStartingPos: (
    curRow: number,
    curCol: number
  ) => { cableStartingRow: number; cableStartingCol: number; stitch: string };
};

export default function usePixelGridStitchCanvasTools({
  canvasWindowTools,
  savedCanvasDataRef,
  interactionLayerTools,
}: {
  canvasWindowTools: PixelGridWindowTools;
  interactionLayerTools: PixelGridInteractionLayerTools;
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
}): StitchCanvasTools {
  const stitchCanvasRef = useRef(null);
  const [stitchCanvasContext, setStitchCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

  const findCableStitchStartingPos = (curRow: number, curCol: number) => {
    let curCell = savedCanvasDataRef.current.pixels[curRow][curCol];
    while (!(curCell.stitch && isCable(curCell.stitch))) {
      curCell = savedCanvasDataRef.current.pixels[curRow][curCol - 1];
    }
    return {
      cableStartingRow: curRow,
      cableStartingCol: curCol,
      stitch: curCell.stitch,
    };
  };

  const drawStitchPathStep = (
    x: number,
    y: number,
    svgPathStep: SvgPath,
    context: CanvasRenderingContext2D,
    windowTools: PixelGridWindowTools
  ) => {
    context.lineWidth = 2;
    context.lineJoin = "round";
    context.lineCap = "round";
    if (svgPathStep[1] === "stroke") {
      context.stroke(
        createFromSvgPath(
          x,
          y,
          windowTools.canvasCellDimensions.width,
          windowTools.canvasCellDimensions.height,
          svgPathStep[0]
        )
      );
    } else {
      context.fill(
        createFromSvgPath(
          x,
          y,
          windowTools.canvasCellDimensions.width,
          windowTools.canvasCellDimensions.height,
          svgPathStep[0]
        )
      );
    }
  };

  const drawCableStitch = (
    x: number,
    y: number,
    stitch: string,
    context: CanvasRenderingContext2D,
    windowTools: PixelGridWindowTools
  ) => {
    const stitchWidthUnit = getCableStitchWidthUnits(stitch);
    context.fillStyle = "white";
    context.fillRect(
      x,
      y,
      windowTools.canvasCellDimensions.width * stitchWidthUnit,
      canvasWindowTools.canvasCellDimensions.height
    );
    context.strokeRect(
      x,
      y,
      windowTools.canvasCellDimensions.width * stitchWidthUnit,
      canvasWindowTools.canvasCellDimensions.height
    );
    const svgPaths = KNITTING_CABLE_STITCHES[stitch].svgPaths;
    context.strokeStyle = "#000";
    context.lineWidth = 2;
    context.lineJoin = "round";
    context.lineCap = "round";

    for (const svgPath of svgPaths) {
      context.fillStyle = svgPath[1];
      const path = createCableFromSvgPath(
        x,
        y,
        windowTools.canvasCellDimensions.width,
        windowTools.canvasCellDimensions.height,
        svgPath[0]
      );
      context.fill(path);
      context.stroke(path);
    }
    context.strokeStyle = "gray";
    context.strokeRect(
      x,
      y,
      windowTools.canvasCellDimensions.width * stitchWidthUnit,
      canvasWindowTools.canvasCellDimensions.height
    );
  };

  const updateStitch = ({
    row,
    col,
    stitch,
    color,
    ctx,
    windowTools,
  }: {
    row: number;
    col: number;
    stitch?: string;
    color: string;
    ctx?: CanvasRenderingContext2D;
    windowTools?: Partial<PixelGridWindowTools>;
  }) => {
    const context = ctx || (stitchCanvasContext as CanvasRenderingContext2D);
    context.strokeStyle = color;
    context.fillStyle = color;
    const curCanvasWindowTools = {
      ...canvasWindowTools,
      ...windowTools,
    };
    const { x, y } = interactionLayerTools.getXYCoordsFromPixelPos({
      row,
      col,
      windowTools: curCanvasWindowTools,
    });
    context.clearRect(
      x,
      y,
      curCanvasWindowTools.canvasCellDimensions.width,
      curCanvasWindowTools.canvasCellDimensions.height
    );
    if (stitch) {
      if (isCable(stitch)) {
        drawCableStitch(x, y, stitch, context, curCanvasWindowTools);
      } else {
        const svgPathSteps = KNITTING_STITCHES[stitch].svgPaths;
        if (isSvgPath(svgPathSteps)) {
          drawStitchPathStep(x, y, svgPathSteps, context, curCanvasWindowTools);
        } else {
          for (const svgPathStep of svgPathSteps) {
            drawStitchPathStep(
              x,
              y,
              svgPathStep,
              context,
              curCanvasWindowTools
            );
          }
        }
      }
    }
  };

  return {
    ctx: stitchCanvasContext,
    setCtx: setStitchCanvasContext,
    ref: stitchCanvasRef,
    updateStitch,
    findCableStitchStartingPos,
  };
}

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

export const createCableFromSvgPath = (
  x: number,
  y: number,
  width: number,
  height: number,
  d: string
) => {
  const path = new Path2D();
  const mat = new DOMMatrix();
  mat.translateSelf(x + width / 100, y + height / 100);
  mat.scaleSelf(width / 100, height / 100, 1);
  path.addPath(new Path2D(d), mat);
  return path;
};
