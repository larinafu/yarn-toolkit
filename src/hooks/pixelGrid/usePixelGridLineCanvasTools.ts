import { useRef, useState } from "react";
import canvasContextUtils from "@/utils/pixelGrid/canvasContextUtils";
import { PixelGridWindowTools } from "./usePixelGridWindowTools";
import { StitchCanvasTools } from "./usePixelGridStitchCanvasTools";

export type PixelGridLineCanvasTools = {
  ctx: CanvasRenderingContext2D | null;
  setCtx: React.Dispatch<React.SetStateAction<CanvasRenderingContext2D | null>>;
  drawCanvasLines: ({
    ctx,
    windowTools,
    lineColor,
    stitchCtx,
  }: {
    ctx?: CanvasRenderingContext2D;
    windowTools?: Partial<PixelGridWindowTools>;
    lineColor?: string;
    stitchCtx?: CanvasRenderingContext2D;
  }) => void;
  ref: React.RefObject<HTMLCanvasElement | null>;
};

export default function usePixelGridLineCanvasTools({
  canvasWindowTools,
  gridLineColor,
  stitchCanvasTools,
}: {
  canvasWindowTools: PixelGridWindowTools;
  gridLineColor: string;
  stitchCanvasTools: StitchCanvasTools;
}): PixelGridLineCanvasTools {
  const lineCanvasRef = useRef(null);
  const [lineCanvasContext, setLineCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const drawCanvasLines = ({
    ctx,
    windowTools,
    lineColor,
    stitchCtx,
  }: {
    ctx?: CanvasRenderingContext2D;
    windowTools?: Partial<PixelGridWindowTools>;
    lineColor?: string;
    stitchCtx?: CanvasRenderingContext2D;
  }) => {
    const curLineColor = lineColor || gridLineColor;
    const targetContext =
      (ctx as CanvasRenderingContext2D) || lineCanvasContext;
    const targetWindowTools = {
      ...canvasWindowTools,
      ...windowTools,
    };
    canvasContextUtils.drawGridLines({
      cellDimensions: targetWindowTools.canvasCellDimensions,
      gridDimensions: targetWindowTools.gridDimensions,
      ctx: targetContext,
      lineColor: curLineColor,
    });
    stitchCanvasTools.updateFullCanvas({
      gridLineColor: lineColor,
      ctx: stitchCtx,
    });
  };

  return {
    ctx: lineCanvasContext,
    setCtx: setLineCanvasContext,
    drawCanvasLines,
    ref: lineCanvasRef,
  };
}
