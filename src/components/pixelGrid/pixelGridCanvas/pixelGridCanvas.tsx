import React, { useEffect, useMemo, useRef, useState } from "react";

import { PixelGridCanvasSavedData } from "@/types/pixelGrid";
import { PixelGridWindowTools } from "@/hooks/pixelGrid/usePixelGridWindowTools";
import { ColorCanvasTools } from "@/hooks/pixelGrid/useColorCanvasTools";
import { PixelGridLineCanvasTools } from "@/hooks/pixelGrid/usePixelGridLineCanvasTools";
import { PixelGridInteractionLayerTools } from "@/hooks/pixelGrid/usePixelGridInteractionLayerTools";
import { StitchCanvasTools } from "@/hooks/pixelGrid/usePixelGridStitchCanvasTools";
import { PixelGridEditTools } from "@/hooks/pixelGrid/usePixelGridEditTools";
import { useIsPointerDown } from "@/hooks/general/useIsPointerDown";
import { EditMode } from "@/hooks/pixelGrid/usePixelGridEditingConfigTools";
import { PixelGridSpecialShapesCanvasTools } from "@/hooks/pixelGrid/usePixelGridSpecialShapesCanvasTools";
import SpecialShapePoint from "../specialShapePoint/specialShapePoint";
import SpecialShapeLine from "../specialShapeLine/specialShapeLine";

export default function PixelGridCanvas({
  curPixel,
  setCurPixel,
  curRow,
  activeShapeIdx,
  setActiveShapeIdx,
  savedCanvasData,
  canvasWindowTools,
  colorCanvasTools,
  gridLineTools,
  interactionLayerTools,
  canvasEditTools,
  editMode,
  stitchCanvasTools,
  specialShapesTools,
  shapeColor,
  pixelGridCanvasRefWithRect,
  isPointerDownFromCanvas,
  setPointerDownFromCanvas,
  stitchWidthUnit,
}: {
  activeShapeIdx: number | "erase" | null;
  setActiveShapeIdx: React.Dispatch<
    React.SetStateAction<number | "erase" | null>
  >;
  curPixel: any;
  setCurPixel: any;
  curRow: number;
  savedCanvasData: PixelGridCanvasSavedData;
  canvasWindowTools: PixelGridWindowTools;
  colorCanvasTools: ColorCanvasTools;
  gridLineTools: PixelGridLineCanvasTools;
  interactionLayerTools: PixelGridInteractionLayerTools;
  canvasEditTools: PixelGridEditTools;
  editMode: EditMode;
  stitchCanvasTools: StitchCanvasTools;
  specialShapesTools: PixelGridSpecialShapesCanvasTools;
  shapeColor: string;
  pixelGridCanvasRefWithRect: {
    ref: React.RefObject<any>;
    getDims: () => DOMRect | undefined;
  };
  isPointerDownFromCanvas: boolean;
  setPointerDownFromCanvas: React.Dispatch<React.SetStateAction<boolean>>;
  stitchWidthUnit: number;
}) {
  const pointerEventsRef = useRef<any>(null);
  useIsPointerDown({
    handlePointerUp: () => {
      setPointerDownFromCanvas(false);
    },
  });

  useEffect(() => {
    const colorCanvasRef =
      colorCanvasTools.ref as React.RefObject<HTMLCanvasElement>;
    const stitchCanvasRef =
      stitchCanvasTools.ref as React.RefObject<HTMLCanvasElement>;
    const lineCanvasRef =
      gridLineTools.ref as React.RefObject<HTMLCanvasElement>;
    const specialShapesCanvasRef =
      specialShapesTools.ref as React.RefObject<HTMLCanvasElement>;
    const colorCanvasContext = colorCanvasRef.current.getContext("2d");
    const lineCanvasContext = lineCanvasRef.current.getContext("2d");
    const stitchCanvasContext = stitchCanvasRef.current.getContext("2d");
    const specialShapesCanvasContext =
      specialShapesCanvasRef.current.getContext("2d");
    canvasWindowTools.resizeCanvas(
      colorCanvasRef,
      canvasWindowTools.gridDimensions.width,
      canvasWindowTools.gridDimensions.height
    );
    canvasWindowTools.resizeCanvas(
      lineCanvasRef,
      canvasWindowTools.gridDimensions.width,
      canvasWindowTools.gridDimensions.height
    );
    canvasWindowTools.resizeCanvas(
      stitchCanvasRef,
      canvasWindowTools.gridDimensions.width,
      canvasWindowTools.gridDimensions.height
    );
    canvasWindowTools.resizeCanvas(
      specialShapesCanvasRef,
      canvasWindowTools.gridDimensions.width,
      canvasWindowTools.gridDimensions.height
    );
    colorCanvasTools.setCtx(colorCanvasContext);
    gridLineTools.setCtx(lineCanvasContext);
    stitchCanvasTools.setCtx(stitchCanvasContext);
    specialShapesTools.setCtx(specialShapesCanvasContext);
    gridLineTools.drawCanvasLines({
      ctx: lineCanvasContext as CanvasRenderingContext2D,
      stitchCtx: stitchCanvasContext as CanvasRenderingContext2D,
    });
    for (
      let row = canvasWindowTools.canvasWindow.startRow;
      row <
      canvasWindowTools.canvasWindow.startRow +
        canvasWindowTools.canvasWindow.visibleRows;
      row++
    ) {
      for (
        let col = canvasWindowTools.canvasWindow.startCol;
        col <
        canvasWindowTools.canvasWindow.startCol +
          canvasWindowTools.canvasWindow.visibleCols;
        col++
      ) {
        colorCanvasTools.updatePixelOnInitialRender(
          row,
          col,
          savedCanvasData.pixels[row][col].hex,
          colorCanvasContext as CanvasRenderingContext2D
        );
        if (savedCanvasData.pixels[row][col].stitch) {
          stitchCanvasTools.updateStitch({
            row,
            col,
            stitch: savedCanvasData.pixels[row][col].stitch as string,
            color: savedCanvasData.pixels[row][col].stitchColor || "#000",
          });
        }
      }
    }
    specialShapesTools.drawShapesOnCanvas({ ctx: specialShapesCanvasContext });
  }, [
    canvasWindowTools.gridDimensions.width,
    canvasWindowTools.gridDimensions.height,
  ]);

  const pixelPos =
    curPixel &&
    interactionLayerTools.getXYCoordsFromPixelPos({
      row: curPixel[0],
      col: curPixel[1],
    });

  const handlePointerMove = (e: PointerEvent) => {
    const { row, col } = interactionLayerTools.getPixelPosFromPointerCoords(
      e,
      editMode
    );
    if (!curPixel || row !== curPixel[0] || col !== curPixel[1]) {
      setCurPixel([row, col]);
    }
  };

  const pointer = useMemo(() => {
    if (pixelPos) {
      switch (editMode) {
        case "colorChange":
          return (
            <rect
              x={pixelPos.x}
              y={pixelPos.y}
              width={canvasWindowTools.canvasCellDimensions.width}
              height={canvasWindowTools.canvasCellDimensions.height}
              fill="none"
              stroke="red"
              strokeWidth={2}
              className="pointer-events-none"
            ></rect>
          );
        case "symbolChange":
          return (
            <rect
              x={pixelPos.x}
              y={pixelPos.y}
              width={
                canvasWindowTools.canvasCellDimensions.width * stitchWidthUnit
              }
              height={canvasWindowTools.canvasCellDimensions.height}
              fill="none"
              stroke="red"
              strokeWidth={2}
              className="pointer-events-none"
            ></rect>
          );
        case "specialShapeChange":
          return (
            <circle
              cx={pixelPos.x}
              cy={pixelPos.y}
              r={3}
              fill="red"
              className="pointer-events-none"
            ></circle>
          );
      }
    }
  }, [curPixel, editMode]);

  const canvasLayerStyle = "absolute top-0 left-0";

  const didPointerActuallyLeave = (e: any) =>
    e.nativeEvent.offsetX <= 0 ||
    e.nativeEvent.offsetY <= 0 ||
    e.nativeEvent.offsetX >= canvasWindowTools.gridDimensions.width ||
    e.nativeEvent.offsetY >= canvasWindowTools.gridDimensions.height;

  return (
    <div className="touch-none">
      <canvas ref={colorCanvasTools.ref}></canvas>
      <canvas ref={gridLineTools.ref} className={canvasLayerStyle}></canvas>
      <canvas className={canvasLayerStyle} ref={stitchCanvasTools.ref}></canvas>
      <canvas
        className={`${canvasLayerStyle} ${
          editMode === "specialShapeChange" ? "hidden" : ""
        }`}
        ref={specialShapesTools.ref}
      ></canvas>
      <svg
        ref={pointerEventsRef}
        className={`${canvasLayerStyle} cursor-pointer`}
        width={canvasWindowTools.gridDimensions.width}
        height={canvasWindowTools.gridDimensions.height}
        onPointerMove={(e: any) => {
          handlePointerMove(e);
          if (isPointerDownFromCanvas && typeof activeShapeIdx !== "string") {
            canvasEditTools.handleCanvasEdit(e, "move");
          }
        }}
        onPointerDown={(e) => {
          if (e.isPrimary) {
            setPointerDownFromCanvas(true);
            if (editMode !== "specialShapeChange" || activeShapeIdx !== null) {
              (pointerEventsRef.current as any).releasePointerCapture(
                e.pointerId
              );
              canvasEditTools.handleCanvasEdit(e, "down");
            }
          }
        }}
        onContextMenu={(e) => e.preventDefault()}
        onPointerLeave={(e) => {
          if (didPointerActuallyLeave(e)) {
            setCurPixel(null);
            if (isPointerDownFromCanvas) {
              canvasEditTools.handleCompleteCanvasEdit();
              specialShapesTools.releasePoint();
              setActiveShapeIdx(null);
            }
          }
        }}
        onPointerUp={(e) => {
          setCurPixel(null);
          if (
            isPointerDownFromCanvas &&
            (editMode !== "specialShapeChange" ||
              specialShapesTools.tarPoint ||
              activeShapeIdx === "erase")
          ) {
            specialShapesTools.releasePoint();
            setActiveShapeIdx(null);
            canvasEditTools.handleCompleteCanvasEdit();
          }
        }}
      >
        {pointer}
        {editMode === "specialShapeChange" &&
          specialShapesTools.specialShapesRef.current.map(
            (specialShape, idx) => {
              const pointsPos = [];
              const path = [];
              for (const [pointIdx, point] of specialShape.points.entries()) {
                let tarPoint;
                if (
                  specialShapesTools.tarPoint?.shapeId === idx &&
                  specialShapesTools.tarPoint.pointId === pointIdx &&
                  specialShapesTools.tarPoint.curLoc
                ) {
                  tarPoint = specialShapesTools.tarPoint.curLoc;
                } else {
                  tarPoint = point;
                }
                const { x, y } =
                  interactionLayerTools.getXYCoordsFromPixelPos(tarPoint);
                pointsPos.push({ x, y });
                path.push(`${path.length === 0 ? "M" : "L"} ${x} ${y}`);
              }

              return (
                <g key={idx}>
                  <SpecialShapeLine
                    d={path.join(" ")}
                    stroke={specialShape.color}
                    strokeWidth={5}
                    activeShapeIdx={activeShapeIdx}
                    canvasEditTools={canvasEditTools}
                    shapeIdx={idx}
                    isPointerDownFromCanvas={isPointerDownFromCanvas}
                  />
                  {pointsPos.map(({ x, y }, pointIdx) => {
                    return (
                      <SpecialShapePoint
                        key={pointIdx}
                        x={x}
                        y={y}
                        pointIdx={pointIdx}
                        shapeIdx={idx}
                        cellDims={canvasWindowTools.canvasCellDimensions}
                        specialShapesTools={specialShapesTools}
                        setPointerDownFromCanvas={setPointerDownFromCanvas}
                        activeShapeIdx={activeShapeIdx}
                        setActiveShapeIdx={setActiveShapeIdx}
                        canvasEditTools={canvasEditTools}
                        isPointerDownFromCanvas={isPointerDownFromCanvas}
                      />
                    );
                  })}
                </g>
              );
            }
          )}
      </svg>
    </div>
  );
}
