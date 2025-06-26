import { PixelGridEditTools } from "@/hooks/pixelGrid/usePixelGridEditTools";
import { useRef } from "react";

export default function SpecialShapeLine({
  d,
  stroke,
  strokeWidth,
  activeShapeIdx,
  canvasEditTools,
  shapeIdx,
  isPointerDownFromCanvas,
}: {
  d: string;
  stroke: string;
  strokeWidth: number;
  activeShapeIdx: null | "erase" | number;
  canvasEditTools: PixelGridEditTools;
  shapeIdx: number;
  isPointerDownFromCanvas: boolean;
}) {
  const pathRef = useRef<any>(null);
  return (
    <path
      ref={pathRef}
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      style={{
        pointerEvents: activeShapeIdx === "erase" ? "visibleStroke" : "none",
      }}
      onPointerDown={(e) => {
        pathRef.current?.releasePointerCapture(e.pointerId);
        canvasEditTools.handleCanvasEdit(e, "down", {
          shapeId: shapeIdx,
        });
      }}
      onPointerMove={(e) => {
        if (isPointerDownFromCanvas) {
          canvasEditTools.handleCanvasEdit(e, "move", {
            shapeId: shapeIdx,
          });
        }
      }}
    />
  );
}
