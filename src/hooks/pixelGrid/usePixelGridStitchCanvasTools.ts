import { useRef, useState } from "react";
import { PixelGridWindowTools } from "./usePixelGridWindowTools";
import { PixelGridInteractionLayerTools } from "./usePixelGridInteractionLayerTools";
import {
  isSvgPath,
  PixelGridCanvasSavedData,
  SvgPath,
} from "@/types/pixelGrid";
import { knitting } from "@/constants/pixelGrid/stitches";

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

  const drawStitchPathStep = (
    x: number,
    y: number,
    svgPathStep: SvgPath,
    context: CanvasRenderingContext2D,
    windowTools: PixelGridWindowTools
  ) => {
    context.lineWidth = 2;
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
      const svgPathSteps = knitting[stitch].svgPaths;
      if (isSvgPath(svgPathSteps)) {
        drawStitchPathStep(x, y, svgPathSteps, context, curCanvasWindowTools);
      } else {
        for (const svgPathStep of svgPathSteps) {
          drawStitchPathStep(x, y, svgPathStep, context, curCanvasWindowTools);
        }
      }
    }
  };

  return {
    ctx: stitchCanvasContext,
    setCtx: setStitchCanvasContext,
    ref: stitchCanvasRef,
    updateStitch,
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
  mat.translateSelf(
    x + 100 * (width / 100) * 0.1,
    y + 100 * (height / 100) * 0.1
  );
  mat.scaleSelf((width / 100) * 0.8, (height / 100) * 0.8, 1);
  path.addPath(new Path2D(d), mat);
  return path;
};
