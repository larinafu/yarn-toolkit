import {
  PixelGridCanvasSavedData,
  PixelGridCanvasWindow,
} from "@/types/pixelGrid";
import { useRef, useState } from "react";
import { KNITTING_CABLE_STITCHES } from "@/constants/pixelGrid/stitches";
import { PixelGridWindowTools } from "./usePixelGridWindowTools";

export default function usePixelGridCableCanvasTools({
  canvasWindowTools,
  savedCanvasDataRef,
}: {
  canvasWindowTools: PixelGridWindowTools;
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
}) {
  const cableCanvasRef = useRef(null);
  const [cableCanvasContext, setCableCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

  const drawCableStitch = ({
    type,
    startRow,
    startCol,
    windowTools,
  }: {
    type: string;
    startRow: number;
    startCol: number;
    windowTools?: PixelGridWindowTools;
  }) => {};

  return {
    ctx: cableCanvasContext,
    setCtx: setCableCanvasContext,
  };
}
