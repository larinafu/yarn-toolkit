import { PixelGridCanvasWindow } from "@/types/pixelGrid";
import { PixelGridWindowTools } from "./usePixelGridWindowTools";
import { EditMode } from "./usePixelGridEditingConfigTools";

export type PixelGridInteractionLayerTools = {
  getRowPos: (row: number, canvasWindow?: PixelGridCanvasWindow) => number;
  getColPos: (col: number, canvasWindow?: PixelGridCanvasWindow) => number;
  getXYCoordsFromPixelPos: ({
    row,
    col,
    windowTools,
  }: {
    row: number;
    col: number;
    windowTools?: PixelGridWindowTools;
  }) => { x: number; y: number };
  getPixelPosFromPointerCoords: (
    e: any,
    editMode: EditMode
  ) => { row: number; col: number };
};

export default function usePixelGridInteractionLayerTools({
  canvasWindowTools,
}: {
  canvasWindowTools: PixelGridWindowTools;
}): PixelGridInteractionLayerTools {
  const getRowPos = (row: number, canvasWindow?: PixelGridCanvasWindow) =>
    row -
    (canvasWindow?.startRow || canvasWindow?.startRow === 0
      ? canvasWindow.startRow
      : canvasWindowTools.canvasWindow.startRow);
  const getColPos = (col: number, canvasWindow?: PixelGridCanvasWindow) =>
    col -
    (canvasWindow?.startCol || canvasWindow?.startCol === 0
      ? canvasWindow?.startCol
      : canvasWindowTools.canvasWindow.startCol);
  const getXYCoordsFromPixelPos = ({
    row,
    col,
    windowTools,
  }: {
    row: number;
    col: number;
    windowTools?: PixelGridWindowTools;
  }) => {
    const curCanvasWindowTools = {
      ...canvasWindowTools,
      ...windowTools,
    };
    const [curPixelWidth, curPixelHeight] = [
      curCanvasWindowTools.canvasCellDimensions.width,
      curCanvasWindowTools.canvasCellDimensions.height,
    ];
    return {
      x: curPixelWidth * getColPos(col, curCanvasWindowTools.canvasWindow),
      y: curPixelHeight * getRowPos(row, curCanvasWindowTools.canvasWindow),
    };
  };

  const getPixelPosFromPointerCoords = (e: any, editMode: EditMode) => {
    const roundWithMethod =
      editMode === "specialShapeChange" ? Math.round : Math.floor;
    const edge = editMode === "specialShapeChange" ? 0 : 1;
    const pointerEvent = e.nativeEvent as PointerEvent;
    const [x, y] = [pointerEvent.offsetX, pointerEvent.offsetY];
    const col = Math.max(
      0,
      Math.min(
        roundWithMethod(x / canvasWindowTools.canvasCellDimensions.width) +
          canvasWindowTools.canvasWindow.startCol,
        canvasWindowTools.canvasNumRowsAndCols.numCols - edge
      )
    );
    const row = Math.max(
      0,
      Math.min(
        roundWithMethod(y / canvasWindowTools.canvasCellDimensions.height) +
          canvasWindowTools.canvasWindow.startRow,
        canvasWindowTools.canvasNumRowsAndCols.numRows - edge
      )
    );
    return { row, col };
  };
  return {
    getColPos,
    getRowPos,
    getXYCoordsFromPixelPos,
    getPixelPosFromPointerCoords,
  };
}
