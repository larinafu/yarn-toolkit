import React, { useRef, useState } from "react";
import { PixelGridWindowTools } from "./usePixelGridWindowTools";
import { PixelGridInteractionLayerTools } from "./usePixelGridInteractionLayerTools";
import canvasContextUtils from "@/utils/pixelGrid/canvasContextUtils";

export type PixelGridSpecialShapesCanvasTools = {
  ref: React.RefObject<HTMLCanvasElement | null>;
  ctx: CanvasRenderingContext2D | null;
  setCtx: React.Dispatch<React.SetStateAction<CanvasRenderingContext2D | null>>;
  specialShapesRef: React.RefObject<SpecialShape[]>;
  addShape: (row: number, col: number, color: string, shape: "line") => void;
  removeShape: (idx: number) => void;
  captureShape: (shapeId: number, pointId?: number) => void;
  releasePoint: () => void;
  moveTarPoint: (newPoint: Point) => void;
  tarPoint: {
    shapeId: number;
    pointId: number | null;
    curLoc: Point | null;
  } | null;
  drawShapesOnCanvas: ({
    windowTools,
    ctx,
  }: {
    windowTools?: Partial<PixelGridWindowTools>;
    ctx?: CanvasRenderingContext2D | null;
  }) => void;
  setChangedShapes: React.Dispatch<React.SetStateAction<number[]>>;
};

export type Point = { row: number; col: number };

export type SpecialShape = {
  shape: "line";
  color: string;
  points: Point[];
};

export default function usePixelGridSpecialShapesCanvasTools({
  canvasWindowTools,
  interactionLayerTools,
}: {
  canvasWindowTools: PixelGridWindowTools;
  interactionLayerTools: PixelGridInteractionLayerTools;
}): PixelGridSpecialShapesCanvasTools {
  const specialShapesCanvasRef = useRef(null);
  const [specialShapesCtx, setSpecialShapesCtx] =
    useState<CanvasRenderingContext2D | null>(null);
  const specialShapesRef = useRef<SpecialShape[]>([]);
  const [tarPoint, setTarPoint] = useState<{
    shapeId: number;
    pointId: number | null;
    curLoc: Point | null;
  } | null>(null);

  const [changedShapes, setChangedShapes] = useState<number[]>([]);

  const specialShapesRefLength = specialShapesRef.current.length;

  const addShape = (row: number, col: number, color: string, shape: "line") => {
    setTarPoint({
      shapeId: specialShapesRef.current.length,
      pointId: 1,
      curLoc: { row, col },
    });
    specialShapesRef.current.push({
      shape,
      color,
      points: [
        { row, col },
        { row, col },
      ],
    });
  };

  const removeShape = (idx: number) => {
    specialShapesRef.current = [
      ...specialShapesRef.current.slice(0, idx),
      ...specialShapesRef.current.slice(idx + 1),
    ];
    setChangedShapes([...changedShapes, idx]);
  };

  const captureShape = (shapeId: number, pointId?: number) => {
    setTarPoint({
      shapeId,
      pointId: pointId !== undefined ? pointId : null,
      curLoc:
        pointId !== undefined
          ? specialShapesRef.current[shapeId].points[pointId]
          : null,
    });
  };

  const releasePoint = () => {
    setTarPoint(null);
  };

  const moveTarPoint = (newPoint: Point) => {
    if (tarPoint) {
      setTarPoint({ ...tarPoint, curLoc: newPoint });
    }
  };

  const drawShapesOnCanvas = ({
    windowTools,
    ctx,
  }: {
    windowTools?: Partial<PixelGridWindowTools>;
    ctx?: CanvasRenderingContext2D | null;
  }) => {
    const tarCtx = ctx || (specialShapesCtx as CanvasRenderingContext2D);
    const tarWindowTools = {
      ...canvasWindowTools,
      ...windowTools,
    };
    tarCtx.clearRect(
      0,
      0,
      tarWindowTools.gridDimensions.width,
      tarWindowTools.gridDimensions.height
    );
    tarCtx.lineWidth = 5;
    for (const shape of specialShapesRef.current) {
      tarCtx.strokeStyle = shape.color;
      const linePath = [];
      for (const point of shape.points) {
        const { x, y } = interactionLayerTools.getXYCoordsFromPixelPos({
          windowTools: tarWindowTools,
          ...point,
        });
        linePath.push(`${linePath.length ? "L" : "M"} ${x} ${y}`);
      }
      tarCtx.stroke(new Path2D(linePath.join(" ")));
    }
  };

  return {
    ref: specialShapesCanvasRef,
    ctx: specialShapesCtx,
    setCtx: setSpecialShapesCtx,
    specialShapesRef,
    addShape,
    captureShape,
    releasePoint,
    moveTarPoint,
    tarPoint,
    drawShapesOnCanvas,
    removeShape,
    setChangedShapes,
  };
}
