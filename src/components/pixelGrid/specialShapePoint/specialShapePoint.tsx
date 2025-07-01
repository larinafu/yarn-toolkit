import { PixelGridSpecialShapesCanvasTools } from "@/hooks/pixelGrid/usePixelGridSpecialShapesCanvasTools";
import { PixelGridCanvasCellDimensions } from "@/types/pixelGrid";
import React, { useRef } from "react";

export default function SpecialShapePoint({
  shapeIdx,
  pointIdx,
  x,
  y,
  cellDims,
  specialShapesTools,
  setPointerDownFromCanvas,
  activeShapeIdx,
  setActiveShapeIdx,
}: {
  shapeIdx: number;
  pointIdx: number;
  x: number;
  y: number;
  cellDims: PixelGridCanvasCellDimensions;
  specialShapesTools: PixelGridSpecialShapesCanvasTools;
  setPointerDownFromCanvas: React.Dispatch<React.SetStateAction<boolean>>;
  activeShapeIdx: number | "erase" | null;
  setActiveShapeIdx: React.Dispatch<
    React.SetStateAction<number | "erase" | null>
  >;
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
        onPointerDown={() => {
          if (activeShapeIdx === null) {
            specialShapesTools.captureShape(shapeIdx, pointIdx);
          }
        }}
        className={`z-20 ${
          activeShapeIdx !== null ? "pointer-events-none" : ""
        }`}
      ></rect>
    </>
  );
}
