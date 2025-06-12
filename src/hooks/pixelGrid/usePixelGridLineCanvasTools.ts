import { useRef, useState } from "react";
import canvasContextUtils from "@/utils/pixelGrid/canvasContextUtils";
import { PixelGridWindowTools } from "./usePixelGridWindowTools";

export type PixelGridLineCanvasTools = {
  ctx: CanvasRenderingContext2D | null;
  setCtx: React.Dispatch<React.SetStateAction<CanvasRenderingContext2D | null>>;
  handleInitialRender: (ctx: CanvasRenderingContext2D) => void;
  drawCanvasLines: ({
    ctx,
    windowTools,
  }: {
    ctx?: CanvasRenderingContext2D;
    windowTools?: Partial<PixelGridWindowTools>;
  }) => void;
  ref: React.RefObject<HTMLCanvasElement | null>;
};

export default function usePixelGridLineCanvasTools({
  canvasWindowTools,
}: {
  canvasWindowTools: PixelGridWindowTools;
}): PixelGridLineCanvasTools {
  const lineCanvasRef = useRef(null);
  const [lineCanvasContext, setLineCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const drawCanvasLines = ({
    ctx,
    windowTools,
  }: {
    ctx?: CanvasRenderingContext2D;
    windowTools?: Partial<PixelGridWindowTools>;
  }) => {
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
    });
  };

  return {
    ctx: lineCanvasContext,
    setCtx: setLineCanvasContext,
    handleInitialRender: (ctx: CanvasRenderingContext2D) =>
      drawCanvasLines({ ctx }),
    drawCanvasLines,
    ref: lineCanvasRef,
  };
}
