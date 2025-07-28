import {
  PixelGridCanvasCellDimensions,
  PixelGridCanvasNumRowsAndCols,
  PixelGridCanvasSavedData,
  PixelGridCanvasWindow,
  PixelGridCellWidthHeightRatio,
} from "@/types/pixelGrid";
import React, { useState, useRef } from "react";
import { PixelGridWindowTools } from "./usePixelGridWindowTools";
import { vhToPx, vwToPx } from "@/utils/general/sizeConversionUtils";
import canvasSizingUtils from "@/utils/pixelGrid/canvasSizingUtils";
import canvasContextUtils from "@/utils/pixelGrid/canvasContextUtils";
import { SpecialShape } from "./usePixelGridSpecialShapesCanvasTools";

const MAX_PREVIEW_WIDTH_VW = 20;
const MAX_PREVIEW_HEIGHT_VH = 70;
const MIN_DIM_PX = 200;

type ViewboxDims = PixelGridCanvasCellDimensions;
type ViewboxCellDims = PixelGridCanvasCellDimensions;
type PointerActions = {
  isPointerDown: boolean;
  handleViewboxGrab: (e: any) => void;
  handleViewboxRelease: () => void;
  handleViewboxMove: (e: any) => PixelGridCanvasWindow | undefined;
};

export type ViewboxPosition = {
  viewableBoxXPos: number;
  viewableBoxYPos: number;
  viewableBoxWidthPx: number;
  viewableBoxHeightPx: number;
};

export type ViewboxTools = {
  ref: React.RefObject<HTMLCanvasElement | null>;
  specialShapesRef: React.RefObject<HTMLCanvasElement | null>;
  ctx: CanvasRenderingContext2D | null;
  setCtx: React.Dispatch<React.SetStateAction<CanvasRenderingContext2D | null>>;
  specialShapesCtx: CanvasRenderingContext2D | null;
  setSpecialShapesCtx: React.Dispatch<
    React.SetStateAction<CanvasRenderingContext2D | null>
  >;
  pointerActions: PointerActions;
  updateViewboxPixelColor: ({
    row,
    col,
    hex,
    ctx,
  }: {
    row: number;
    col: number;
    hex: string;
    ctx?: CanvasRenderingContext2D;
  }) => void;
  viewboxDims: ViewboxDims;
  viewboxCellDims: ViewboxCellDims;
  viewboxPosition: ViewboxPosition;
  updateFullCanvas: ({
    windowTools,
    viewContext,
  }: {
    windowTools?: Partial<PixelGridWindowTools>;
    viewContext?: CanvasRenderingContext2D;
  }) => void;
  drawViewboxColors: (ctx?: CanvasRenderingContext2D) => void;
  drawViewboxStitches: (ctx?: CanvasRenderingContext2D) => void;
  drawViewboxSpecialShapes: (args?: {
    ctx?: CanvasRenderingContext2D;
    config?: {
      viewboxDims?: ViewboxCellDims;
      viewboxCellDims?: ViewboxCellDims;
    };
  }) => void;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const getViewboxSizing = ({
  canvasNumRowsAndCols,
  canvasCellWidthHeightRatio,
}: {
  canvasNumRowsAndCols: PixelGridCanvasNumRowsAndCols;
  canvasCellWidthHeightRatio: number;
}): {
  viewboxDims: ViewboxCellDims;
  viewboxCellDims: ViewboxCellDims;
} => {
  const [maxPreviewWidthPx, maxPreviewHeightPx] = [
    Math.max(MIN_DIM_PX, vwToPx(MAX_PREVIEW_WIDTH_VW)),
    Math.max(MIN_DIM_PX, vhToPx(MAX_PREVIEW_HEIGHT_VH)),
  ];
  // width limited
  let prvwPixelWidth = maxPreviewWidthPx / canvasNumRowsAndCols.numCols;
  let prvwPixelHeight = prvwPixelWidth * canvasCellWidthHeightRatio;
  const prvwHeight = Math.floor(prvwPixelHeight) * canvasNumRowsAndCols.numRows;
  if (prvwHeight <= maxPreviewHeightPx) {
    return {
      viewboxDims: {
        width: Math.floor(prvwPixelWidth) * canvasNumRowsAndCols.numCols,
        height: Math.floor(prvwPixelHeight) * canvasNumRowsAndCols.numRows,
      },
      viewboxCellDims: {
        width: Math.floor(prvwPixelWidth),
        height: Math.floor(prvwPixelHeight),
      },
    };
  }
  // height limited
  prvwPixelHeight = maxPreviewHeightPx / canvasNumRowsAndCols.numRows;
  prvwPixelWidth = prvwPixelHeight / canvasCellWidthHeightRatio;
  return {
    viewboxDims: {
      width: Math.floor(prvwPixelWidth) * canvasNumRowsAndCols.numCols,
      height: Math.floor(prvwPixelHeight) * canvasNumRowsAndCols.numRows,
    },
    viewboxCellDims: {
      width: Math.floor(prvwPixelWidth),
      height: Math.floor(prvwPixelHeight),
    },
  };
};

const getViewboxPosition = ({
  canvasNumRowsAndCols,
  pixelGridCanvasWindow,
  widthHeightRatio,
}: {
  canvasNumRowsAndCols: PixelGridCanvasNumRowsAndCols;
  pixelGridCanvasWindow: PixelGridCanvasWindow;
  widthHeightRatio: PixelGridCellWidthHeightRatio;
}): ViewboxPosition => {
  const { cellDims: viewboxCellDims } =
    canvasSizingUtils.getMaxCanvasDimensions({
      canvasNumRowsAndCols,
      canvasCellWidthHeightRatio: widthHeightRatio,
      maxPxWidth: Math.max(MIN_DIM_PX, vwToPx(MAX_PREVIEW_WIDTH_VW)),
      maxPxHeight: Math.max(MIN_DIM_PX, vhToPx(MAX_PREVIEW_HEIGHT_VH)),
    });
  return {
    viewableBoxXPos: pixelGridCanvasWindow.startCol * viewboxCellDims.width,
    viewableBoxYPos: pixelGridCanvasWindow.startRow * viewboxCellDims.height,
    viewableBoxWidthPx:
      pixelGridCanvasWindow.visibleCols * viewboxCellDims.width,
    viewableBoxHeightPx:
      pixelGridCanvasWindow.visibleRows * viewboxCellDims.height,
  };
};

export default function useViewboxTools({
  pixelGridCanvasWindowTools,
  savedCanvasDataRef,
  specialShapesRef,
}: {
  pixelGridCanvasWindowTools: PixelGridWindowTools;
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  specialShapesRef: React.RefObject<SpecialShape[]>;
}): ViewboxTools {
  const viewboxRef: React.RefObject<HTMLCanvasElement | null> = useRef(null);
  const viewboxSpecialShapesRef = useRef(null);
  const [viewboxContext, setViewboxContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const [viewboxSpecialShapesContext, setViewboxSpecialShapesContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const widthHeightRatio =
    savedCanvasDataRef.current.swatch.width /
    savedCanvasDataRef.current.swatch.height;
  const pixelGridCanvasWindow = pixelGridCanvasWindowTools.canvasWindow;
  const [pointerDownPos, setPointerDownPos] = useState<{
    left: number;
    top: number;
    firstVisibleRow: number;
    firstVisibleCol: number;
  } | null>(null);
  const [isOpen, setOpen] = useState(true);
  const { viewboxDims, viewboxCellDims } = getViewboxSizing({
    canvasNumRowsAndCols: pixelGridCanvasWindowTools.canvasNumRowsAndCols,
    canvasCellWidthHeightRatio: widthHeightRatio,
  });
  const updateViewboxPixelColor = ({
    row,
    col,
    hex,
    ctx,
    cellDims,
  }: {
    row: number;
    col: number;
    hex: string;
    cellDims?: ViewboxCellDims;
    ctx?: CanvasRenderingContext2D;
  }) => {
    const curViewboxCellDims = cellDims || viewboxCellDims;
    const context = ctx || (viewboxContext as CanvasRenderingContext2D);
    context.fillStyle = hex;
    context.fillRect(
      col * curViewboxCellDims.width,
      row * curViewboxCellDims.height,
      curViewboxCellDims.width,
      curViewboxCellDims.height
    );
  };

  const drawViewboxSpecialShapes = ({
    ctx,
    config,
  }: {
    ctx?: CanvasRenderingContext2D;
    config?: {
      viewboxDims?: ViewboxCellDims;
      viewboxCellDims?: ViewboxCellDims;
    };
  } = {}) => {
    canvasContextUtils.drawSpecialShapes({
      specialShapesCtx:
        ctx || (viewboxSpecialShapesContext as CanvasRenderingContext2D),
      specialShapes: specialShapesRef.current,
      cellDims: config?.viewboxCellDims || viewboxCellDims,
      gridDims: config?.viewboxDims || viewboxDims,
    });
  };

  const updateFullCanvas = ({
    windowTools,
    viewContext,
  }: {
    windowTools?: Partial<PixelGridWindowTools>;
    viewContext?: CanvasRenderingContext2D;
  }) => {
    const curWindowTools = {
      ...pixelGridCanvasWindowTools,
      ...windowTools,
    };
    const viewbox = viewboxRef.current as HTMLCanvasElement;
    const ctx = (viewContext ||
      viewboxContext ||
      viewbox.getContext("2d")) as CanvasRenderingContext2D;
    const { viewboxCellDims: newCellDims, viewboxDims: newViewDims } =
      getViewboxSizing({
        canvasNumRowsAndCols: curWindowTools.canvasNumRowsAndCols,
        canvasCellWidthHeightRatio: widthHeightRatio,
      });

    if (
      !(newViewDims.width === parseInt(viewbox.style.width)) ||
      !(newViewDims.height === parseInt(viewbox.style.height))
    ) {
      canvasSizingUtils.resizeCanvas({
        gridWidth: newViewDims.width,
        gridHeight: newViewDims.height,
        ref: viewboxRef as React.RefObject<any>,
      });
      canvasSizingUtils.resizeCanvas({
        gridWidth: newViewDims.width,
        gridHeight: newViewDims.height,
        ref: viewboxSpecialShapesRef as React.RefObject<any>,
      });
      canvasContextUtils.drawPixelGridColors({
        colorCtx: ctx,
        cellDims: newCellDims,
        cells: savedCanvasDataRef.current.pixels,
      });
      canvasContextUtils.drawPixelGridStitches({
        stitchCtx: ctx,
        cellDims: newCellDims,
        cells: savedCanvasDataRef.current.pixels,
      });
      drawViewboxSpecialShapes({
        config: {
          viewboxDims: newViewDims,
          viewboxCellDims: newCellDims,
        },
      });
    }
  };

  return {
    ref: viewboxRef,
    ctx: viewboxContext,
    specialShapesRef: viewboxSpecialShapesRef,
    specialShapesCtx: viewboxSpecialShapesContext,
    isOpen,
    setOpen,
    setSpecialShapesCtx: setViewboxSpecialShapesContext,
    drawViewboxColors: (ctx?: CanvasRenderingContext2D) =>
      canvasContextUtils.drawPixelGridColors({
        colorCtx: ctx || (viewboxContext as CanvasRenderingContext2D),
        cellDims: viewboxCellDims,
        cells: savedCanvasDataRef.current.pixels,
      }),
    drawViewboxStitches: (ctx?: CanvasRenderingContext2D) =>
      canvasContextUtils.drawPixelGridStitches({
        stitchCtx: ctx || (viewboxContext as CanvasRenderingContext2D),
        cellDims: viewboxCellDims,
        cells: savedCanvasDataRef.current.pixels,
      }),
    drawViewboxSpecialShapes,
    setCtx: setViewboxContext,
    pointerActions: {
      isPointerDown: pointerDownPos !== null,
      handleViewboxGrab: (e: PointerEvent) => {
        setPointerDownPos({
          left: e.pageX,
          top: e.pageY,
          firstVisibleRow: pixelGridCanvasWindow.startRow,
          firstVisibleCol: pixelGridCanvasWindow.startCol,
        });
      },
      handleViewboxRelease: () => setPointerDownPos(null),
      handleViewboxMove: (
        e: PointerEvent
      ): PixelGridCanvasWindow | undefined => {
        if (pointerDownPos) {
          const pixelsLeftMoved = e.pageX - pointerDownPos.left;
          const pixelsTopMoved = e.pageY - pointerDownPos.top;
          const colsMoved = Math.floor(pixelsLeftMoved / viewboxCellDims.width);
          const rowsMoved = Math.floor(pixelsTopMoved / viewboxCellDims.height);
          const [maxStartRow, maxStartCol] = [
            pixelGridCanvasWindowTools.canvasNumRowsAndCols.numRows -
              pixelGridCanvasWindowTools.canvasWindow.visibleRows,
            pixelGridCanvasWindowTools.canvasNumRowsAndCols.numCols -
              pixelGridCanvasWindowTools.canvasWindow.visibleCols,
          ];
          const [newRowStart, newColStart] = [
            Math.max(
              Math.min(pointerDownPos.firstVisibleRow + rowsMoved, maxStartRow),
              0
            ),
            Math.max(
              Math.min(pointerDownPos.firstVisibleCol + colsMoved, maxStartCol),
              0
            ),
          ];
          if (
            !(
              newRowStart ===
                pixelGridCanvasWindowTools.canvasWindow.startRow &&
              newColStart === pixelGridCanvasWindowTools.canvasWindow.startCol
            )
          ) {
            pixelGridCanvasWindowTools.shiftWindow({
              newStartRow: newRowStart,
              newStartCol: newColStart,
            });
          }
          return {
            ...pixelGridCanvasWindow,
            startRow: newRowStart,
            startCol: newColStart,
          };
        }
      },
    },
    updateViewboxPixelColor,
    viewboxDims,
    viewboxCellDims,
    viewboxPosition: getViewboxPosition({
      canvasNumRowsAndCols: pixelGridCanvasWindowTools.canvasNumRowsAndCols,
      pixelGridCanvasWindow,
      widthHeightRatio,
    }),
    updateFullCanvas,
  };
}
