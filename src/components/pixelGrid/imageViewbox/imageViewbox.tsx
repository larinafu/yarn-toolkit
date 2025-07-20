import React, { useRef, useEffect } from "react";

import useViewboxTools, {
  ViewboxTools,
} from "@/hooks/pixelGrid/useViewboxTools";
import { PixelGridWindowTools } from "@/hooks/pixelGrid/usePixelGridWindowTools";
import { ColorCanvasTools } from "@/hooks/pixelGrid/useColorCanvasTools";
import { StitchCanvasTools } from "@/hooks/pixelGrid/usePixelGridStitchCanvasTools";
import { PixelGridCanvasSavedData } from "@/types/pixelGrid";
import canvasSizingUtils from "@/utils/pixelGrid/canvasSizingUtils";

export default function ImageViewbox({
  canvasWindowTools,
  savedCanvasDataRef,
  updateFullCanvas,
  viewboxTools,
}: {
  canvasWindowTools: PixelGridWindowTools;
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  updateFullCanvas: ({
    colorCanvasContext,
    stitchCanvasContext,
    specialShapesCanvasContext,
    windowTools,
  }: {
    colorCanvasContext?: CanvasRenderingContext2D;
    stitchCanvasContext?: CanvasRenderingContext2D;
    specialShapesCanvasContext?: CanvasRenderingContext2D;
    windowTools?: Partial<PixelGridWindowTools>;
  }) => void;
  viewboxTools: ViewboxTools;
}) {
  const viewboxVisibleRef = useRef(null);

  const [numRows, numCols] = [
    savedCanvasDataRef.current.pixels.length,
    savedCanvasDataRef.current.pixels[0].length,
  ];

  useEffect(() => {
    const viewboxContext = (
      viewboxTools.ref.current as HTMLCanvasElement
    ).getContext("2d") as CanvasRenderingContext2D;
    viewboxTools.setCtx(viewboxContext);
    const viewboxSpecialShapesContext = (
      viewboxTools.specialShapesRef.current as HTMLCanvasElement
    ).getContext("2d") as CanvasRenderingContext2D;
    viewboxTools.setSpecialShapesCtx(viewboxSpecialShapesContext);
    canvasSizingUtils.resizeCanvas({
      ref: viewboxTools.ref as React.RefObject<HTMLCanvasElement>,
      gridWidth: viewboxTools.viewboxDims.width,
      gridHeight: viewboxTools.viewboxDims.height,
    });
    canvasSizingUtils.resizeCanvas({
      ref: viewboxTools.specialShapesRef as React.RefObject<HTMLCanvasElement>,
      gridWidth: viewboxTools.viewboxDims.width,
      gridHeight: viewboxTools.viewboxDims.height,
    });
    viewboxTools.drawViewboxColors(viewboxContext);
  }, []);

  // window resize
  useEffect(() => {
    const handleResize = () => {
      viewboxTools.updateFullCanvas({});
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    canvasWindowTools.canvasNumRowsAndCols.numRows,
    canvasWindowTools.canvasNumRowsAndCols.numCols,
  ]);

  return (
    <section className="m-auto mt-0 mb-0 relative touch-none">
      <canvas ref={viewboxTools.ref}></canvas>
      <canvas
        ref={viewboxTools.specialShapesRef}
        className="absolute top-0 left-0"
      ></canvas>
      <div
        ref={viewboxVisibleRef}
        className="absolute border-2 border-amber-300 hover:cursor-pointer"
        draggable={false}
        style={{
          top: viewboxTools.viewboxPosition.viewableBoxYPos,
          left: viewboxTools.viewboxPosition.viewableBoxXPos,
          width: viewboxTools.viewboxPosition.viewableBoxWidthPx,
          height: viewboxTools.viewboxPosition.viewableBoxHeightPx,
        }}
        onPointerDown={(e) => {
          (viewboxVisibleRef.current as any).setPointerCapture(e.pointerId);
          viewboxTools.pointerActions.handleViewboxGrab(e);
        }}
        onPointerLeave={() => {
          viewboxTools.pointerActions.handleViewboxRelease();
        }}
        onPointerMove={(e) => {
          const newCanvasWindow =
            viewboxTools.pointerActions.handleViewboxMove(e);
          if (viewboxTools.pointerActions.isPointerDown) {
            if (
              !(
                newCanvasWindow?.startRow ===
                  canvasWindowTools.canvasWindow.startRow &&
                newCanvasWindow?.startCol ===
                  canvasWindowTools.canvasWindow.startCol
              )
            ) {
              updateFullCanvas({
                windowTools: {
                  ...canvasWindowTools,
                  canvasWindow: newCanvasWindow,
                },
              });
            }
          }
        }}
        onPointerUp={(e) => {
          (viewboxVisibleRef.current as any).releasePointerCapture(e.pointerId);
          viewboxTools.pointerActions.handleViewboxRelease();
        }}
      ></div>
    </section>
  );
}
