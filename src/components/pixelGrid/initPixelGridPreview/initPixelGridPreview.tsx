import useEffectWithContainerDimensions from "@/hooks/general/useEffectWithContainerDims";
import canvasContextUtils from "@/utils/pixelGrid/canvasContextUtils";
import { PixelGridCanvasSavedData } from "@/types/pixelGrid";

export type BaseCanvasData = { hex: string }[][];

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
            specialShapes: [],
            ref: canvasRef,
            ctx: ctx,
          });
        }
      }
    },
    [savedCanvasData]
  );

  return (
    <div className="flex h-full">
      <section ref={containerDimTools.ref} className={`card grow m-2 mr-4 overflow-auto`}>
        <canvas ref={canvasRef}></canvas>
      </section>
    </div>
  );
}
