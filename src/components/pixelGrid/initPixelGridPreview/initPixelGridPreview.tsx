import useEffectWithContainerDimensions from "@/hooks/general/useEffectWithContainerDims";
import canvasContextUtils from "@/utils/pixelGrid/canvasContextUtils";
import { PixelGridCanvasSavedData } from "@/types/pixelGrid";

export type BaseCanvasData = { hex: string }[][];

const getPreviewSizeWidthLimited = (
  limit: number,
  widthHeightRatio: number,
  numRows: number,
  numCols: number
) => {
  const pixelsPerCol = limit / numCols;
  const pixelsPerRow = pixelsPerCol * widthHeightRatio;
  const previewHeight = pixelsPerRow * numRows;
  return {
    previewWidth: limit,
    previewHeight,
    pixelsPerCol,
    pixelsPerRow,
  };
};

const getPreviewSizeHeightLimited = (
  limit: number,
  widthHeightRatio: number,
  numRows: number,
  numCols: number
) => {
  const pixelsPerRow = limit / numRows;
  const pixelsPerCol = pixelsPerRow / widthHeightRatio;
  const previewWidth = pixelsPerCol * numCols;
  return {
    previewWidth,
    previewHeight: limit,
    pixelsPerCol,
    pixelsPerRow,
  };
};

const getInitialPatternSize = (
  widthHeightRatio: number,
  numRows: number,
  numCols: number
) => {
  const [maxPreviewWidth, maxPreviewHeight] = [500, 500];
  // width limited
  const patternSizeWidthLimited = getPreviewSizeWidthLimited(
    maxPreviewWidth,
    widthHeightRatio,
    numRows,
    numCols
  );
  if (patternSizeWidthLimited.previewHeight <= maxPreviewHeight) {
    return patternSizeWidthLimited;
  }
  // height limited
  return getPreviewSizeHeightLimited(
    maxPreviewHeight,
    widthHeightRatio,
    numRows,
    numCols
  );
};

export default function InitPixelGridPreview({
  savedCanvasData,
  canvasRef,
}: {
  savedCanvasData: PixelGridCanvasSavedData;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  const containerDimTools = useEffectWithContainerDimensions(
    (rect?: DOMRect) => {
      if (rect) {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          canvasContextUtils.drawFullCanvasPreview({
            maxPxWidth: rect.width,
            maxPxHeight: rect.height,
            savedCanvasData: savedCanvasData,
            ref: canvasRef,
            ctx: ctx,
          });
        }
      }
    },
    [savedCanvasData]
  );

  return (
    <section ref={containerDimTools.ref} className={`card h-100 md:h-dvh m-2 mr-4`}>
      <canvas ref={canvasRef}></canvas>
    </section>
  );
}
