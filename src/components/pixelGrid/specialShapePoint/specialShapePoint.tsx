import { PixelGridEditTools } from "@/hooks/pixelGrid/usePixelGridEditTools";
import { PixelGridSpecialShapesCanvasTools } from "@/hooks/pixelGrid/usePixelGridSpecialShapesCanvasTools";
import { PixelGridCanvasCellDimensions } from "@/types/pixelGrid";
import React, { useRef } from "react";

export default function SpecialShapePoint({
  shapeIdx,
  pointIdx,
  x,
  y,
  cellDims,
  canvasEditTools,
  specialShapesTools,
  setPointerDownFromCanvas,
  activeShapeIdx,
  setActiveShapeIdx,
  isPointerDownFromCanvas,
}: {
  shapeIdx: number;
  pointIdx: number;
  x: number;
  y: number;
  cellDims: PixelGridCanvasCellDimensions;
  canvasEditTools: PixelGridEditTools;
  specialShapesTools: PixelGridSpecialShapesCanvasTools;
  setPointerDownFromCanvas: React.Dispatch<React.SetStateAction<boolean>>;
  activeShapeIdx: number | "erase" | null;
  setActiveShapeIdx: React.Dispatch<
    React.SetStateAction<number | "erase" | null>
  >;
  isPointerDownFromCanvas: boolean;
}) {
  const pointRef = useRef<any>(null);
  return (
    <>
      <circle cx={x} cy={y} r={5} className="pointer-events-none"></circle>
      <rect
        x={x - cellDims.width / 2}
        y={y - cellDims.height / 2}
        width={cellDims.width}
        height={cellDims.height}
        fillOpacity={0}
        ref={pointRef}
        onPointerDown={(e) => {
          if (activeShapeIdx === null) {
            specialShapesTools.captureShape(shapeIdx, pointIdx);
          } else if (activeShapeIdx === "erase") {
            canvasEditTools.handleCanvasEdit(e, "down", {
              shapeId: shapeIdx,
            });
          }
        }}
        onPointerMove={(e) => {
          if (activeShapeIdx === "erase" && isPointerDownFromCanvas) {
            canvasEditTools.handleCanvasEdit(e, "down", {
              shapeId: shapeIdx,
            });
          }
        }}
        className={`z-20 ${
          activeShapeIdx !== null && activeShapeIdx !== "erase"
            ? "pointer-events-none"
            : ""
        }`}
      ></rect>
    </>
  );
}
