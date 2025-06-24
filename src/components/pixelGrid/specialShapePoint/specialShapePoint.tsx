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
  setActiveShapeIdx,
}: {
  shapeIdx: number;
  pointIdx: number;
  x: number;
  y: number;
  cellDims: PixelGridCanvasCellDimensions;
  specialShapesTools: PixelGridSpecialShapesCanvasTools;
  setPointerDownFromCanvas: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveShapeIdx: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const pointRef = useRef<any>(null);
  return (
    <g>
      <circle cx={x} cy={y} r={5}></circle>
      <rect
        x={x - cellDims.width / 2}
        y={y - cellDims.height / 2}
        width={cellDims.width}
        height={cellDims.height}
        fillOpacity={0}
        ref={pointRef}
        onPointerDown={(e) => {
          pointRef.current?.releasePointerCapture(e.pointerId);
          setPointerDownFromCanvas(true);
          specialShapesTools.capturePoint(shapeIdx, pointIdx);
        }}
        onPointerUp={() => {
          specialShapesTools.releasePoint();
          setActiveShapeIdx(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`z-20`}
      ></rect>
    </g>
  );
}
