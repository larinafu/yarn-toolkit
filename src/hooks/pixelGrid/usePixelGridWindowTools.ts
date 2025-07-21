import React, { useEffect, useState } from "react";

import {
  PixelGridCanvasCellDimensions,
  PixelGridCanvasDimensions,
  PixelGridCanvasNumRowsAndCols,
  PixelGridCanvasSavedData,
  PixelGridCanvasWindow,
} from "@/types/pixelGrid";
import canvasSizingUtils from "@/utils/pixelGrid/canvasSizingUtils";

export type PixelGridWindowTools = {
  canvasCellDimensions: PixelGridCanvasCellDimensions;
  canvasWindow: PixelGridCanvasWindow;
  canvasNumRowsAndCols: PixelGridCanvasNumRowsAndCols;
  canZoomIn: boolean;
  canZoomOut: boolean;
  getCoordsFromPixel: (row: number, col: number) => { x: number; y: number };
  getGridDimensionsFromCell: (
    canvasCellDimensions: PixelGridCanvasCellDimensions
  ) => PixelGridCanvasCellDimensions;
  gridDimensions: PixelGridCanvasCellDimensions;
  resizeCanvas: (
    ref: React.RefObject<HTMLCanvasElement>,
    canvasWidth?: number,
    canvasHeight?: number
  ) => void;
  shiftWindow: ({
    newStartRow,
    newStartCol,
    newVisibleRows,
    newVisibleCols,
    updateCanvas,
  }: {
    newStartCol?: number;
    newStartRow?: number;
    newVisibleRows?: number;
    newVisibleCols?: number;
    updateCanvas?: boolean;
  }) => PixelGridCanvasWindow;
  shiftPixelSize: (shift: "up" | "down") => {
    canvasWindow: PixelGridCanvasWindow;
    canvasCellDimensions: PixelGridCanvasCellDimensions;
    gridDimensions: PixelGridCanvasCellDimensions;
  };
  recalcGridSize: ({
    cellDimensions,
    numRowsAndCols,
  }: {
    cellDimensions?: PixelGridCanvasCellDimensions;
    numRowsAndCols?: PixelGridCanvasNumRowsAndCols;
  }) => {
    canvasWindow: PixelGridCanvasWindow;
    gridDimensions: PixelGridCanvasCellDimensions;
  };
};

type MaxWindowDimensions = {
  viewWidth: number;
  viewHeight: number;
};

// cell width/height cannot be above/below this in px
const MIN_CELL_DIM = 20;
const MAX_CELL_DIM = 40;

const CELL_DIM_SHIFT = 5;

const getVisibleRowsAndCols = ({
  canvasCellDimensions,
  canvasNumRowsAndCols,
  maxWindowDimensions,
}: {
  canvasCellDimensions: PixelGridCanvasCellDimensions;
  canvasNumRowsAndCols: PixelGridCanvasNumRowsAndCols;
  maxWindowDimensions: MaxWindowDimensions;
}) => {
  // window limits
  const [maxWindowWidthPx, maxWindowHeightPx] = [
    maxWindowDimensions.viewWidth,
    maxWindowDimensions.viewHeight,
  ];
  return {
    visibleRows: Math.min(
      Math.floor(maxWindowHeightPx / canvasCellDimensions.height),
      canvasNumRowsAndCols.numRows
    ),
    visibleCols: Math.min(
      Math.floor(maxWindowWidthPx / canvasCellDimensions.width),
      canvasNumRowsAndCols.numCols
    ),
  };
};

export default function usePixelGridWindowTools({
  canvasCellWidthHeightRatio,
  canvasNumRowsAndCols,
  pixelGridCanvasRefWithRect,
  savedCanvasDataRef,
  updateFullCanvas,
}: {
  canvasCellWidthHeightRatio: number;
  canvasNumRowsAndCols: PixelGridCanvasNumRowsAndCols;
  pixelGridCanvasRefWithRect: {
    ref: React.RefObject<any>;
    getDims: () => DOMRect | undefined;
  };
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  updateFullCanvas: ({
    windowTools,
  }: {
    windowTools?: Partial<PixelGridWindowTools>;
  }) => void;
}): PixelGridWindowTools {
  const maxWindowDimensions = {
    viewWidth: pixelGridCanvasRefWithRect.getDims()?.width || 0,
    viewHeight: pixelGridCanvasRefWithRect.getDims()?.height || 0,
  };
  const isHeightDetermined = canvasCellWidthHeightRatio < 1;
  const pixelSizeShift: PixelGridCanvasDimensions = {
    width: isHeightDetermined
      ? CELL_DIM_SHIFT / canvasCellWidthHeightRatio
      : CELL_DIM_SHIFT,
    height:
      (isHeightDetermined
        ? CELL_DIM_SHIFT / canvasCellWidthHeightRatio
        : CELL_DIM_SHIFT) * canvasCellWidthHeightRatio,
  };
  const [canvasCellWidth, setCanvasCellWidth] = useState(
    isHeightDetermined
      ? MIN_CELL_DIM / canvasCellWidthHeightRatio
      : MIN_CELL_DIM
  );
  const canvasCellHeight = canvasCellWidth * canvasCellWidthHeightRatio;
  const canvasCellDimensions: PixelGridCanvasCellDimensions = {
    width: Math.round(canvasCellWidth),
    height: Math.round(canvasCellHeight),
  };

  const [canvasWindow, setCanvasWindow] = useState<PixelGridCanvasWindow>({
    startRow: 0,
    startCol: 0,
    ...getVisibleRowsAndCols({
      canvasCellDimensions,
      canvasNumRowsAndCols,
      maxWindowDimensions,
    }),
  });

  useEffect(() => {
    setCanvasWindow({
      startRow: 0,
      startCol: 0,
      ...getVisibleRowsAndCols({
        canvasCellDimensions,
        canvasNumRowsAndCols,
        maxWindowDimensions: {
          viewWidth: pixelGridCanvasRefWithRect.getDims()?.width || 0,
          viewHeight: pixelGridCanvasRefWithRect.getDims()?.height || 0,
        },
      }),
    });
  }, []);

  const getRowPos = (row: number) => row - canvasWindow.startRow;
  const getColPos = (col: number) => col - canvasWindow.startCol;

  const getGridDimensionsFromCell = (
    canvasCellDimensions: PixelGridCanvasCellDimensions
  ): PixelGridCanvasCellDimensions => {
    const { visibleRows, visibleCols } = getVisibleRowsAndCols({
      canvasCellDimensions,
      canvasNumRowsAndCols,
      maxWindowDimensions: {
        viewWidth: pixelGridCanvasRefWithRect.getDims()?.width || 0,
        viewHeight: pixelGridCanvasRefWithRect.getDims()?.height || 0,
      },
    });
    return {
      width: visibleCols * canvasCellDimensions.width,
      height: visibleRows * canvasCellDimensions.height,
    };
  };

  const shiftPixelSize = (shift: "up" | "down") => {
    const newCellWidth =
      canvasCellWidth +
      (shift === "up" ? pixelSizeShift.width : -pixelSizeShift.width);
    const newCellHeight = newCellWidth * canvasCellWidthHeightRatio;
    const newCellDim = {
      width: Math.round(newCellWidth),
      height: Math.round(newCellHeight),
    };
    const newVisibleRowsAndCols = getVisibleRowsAndCols({
      canvasCellDimensions: newCellDim,
      canvasNumRowsAndCols,
      maxWindowDimensions,
    });
    let [newRowStart, newColStart] = [
      canvasWindow.startRow,
      canvasWindow.startCol,
    ];
    if (
      newVisibleRowsAndCols.visibleRows + canvasWindow.startRow >
      canvasNumRowsAndCols.numRows
    ) {
      newRowStart =
        canvasNumRowsAndCols.numRows - newVisibleRowsAndCols.visibleRows;
    }
    if (
      newVisibleRowsAndCols.visibleCols + canvasWindow.startCol >
      canvasNumRowsAndCols.numCols
    ) {
      newColStart =
        canvasNumRowsAndCols.numCols - newVisibleRowsAndCols.visibleCols;
    }
    setCanvasCellWidth(newCellWidth);

    const newCanvasWindow: PixelGridCanvasWindow = {
      startCol: newColStart,
      startRow: newRowStart,
      ...newVisibleRowsAndCols,
    };
    setCanvasWindow(newCanvasWindow);
    return {
      canvasWindow: newCanvasWindow,
      canvasCellDimensions: newCellDim,
      gridDimensions: {
        width: newCellDim.width * newCanvasWindow.visibleCols,
        height: newCellDim.height * newCanvasWindow.visibleRows,
      },
    };
  };

  const recalcGridSize = ({
    cellDimensions,
    numRowsAndCols,
  }: {
    cellDimensions?: PixelGridCanvasCellDimensions;
    numRowsAndCols?: PixelGridCanvasNumRowsAndCols;
  }) => {
    const curCanvasCellDimensions = {
      ...canvasCellDimensions,
      cellDimensions,
    };
    const curCanvasNumRowsAndCols = {
      ...canvasNumRowsAndCols,
      ...numRowsAndCols,
    };
    const newVisibleRowsAndCols = getVisibleRowsAndCols({
      canvasCellDimensions: curCanvasCellDimensions,
      canvasNumRowsAndCols: curCanvasNumRowsAndCols,
      maxWindowDimensions: {
        viewWidth: pixelGridCanvasRefWithRect.getDims()?.width || 0,
        viewHeight: pixelGridCanvasRefWithRect.getDims()?.height || 0,
      },
    });
    let [newRowStart, newColStart] = [
      canvasWindow.startRow,
      canvasWindow.startCol,
    ];
    if (
      newVisibleRowsAndCols.visibleRows + canvasWindow.startRow >
      canvasNumRowsAndCols.numRows
    ) {
      newRowStart =
        canvasNumRowsAndCols.numRows - newVisibleRowsAndCols.visibleRows;
    }
    if (
      newVisibleRowsAndCols.visibleCols + canvasWindow.startCol >
      canvasNumRowsAndCols.numCols
    ) {
      newColStart =
        canvasNumRowsAndCols.numCols - newVisibleRowsAndCols.visibleCols;
    }

    const newCanvasWindow: PixelGridCanvasWindow = {
      startCol: newColStart,
      startRow: newRowStart,
      ...newVisibleRowsAndCols,
    };
    setCanvasWindow(newCanvasWindow);

    return {
      canvasWindow: newCanvasWindow,
      gridDimensions: getGridDimensionsFromCell(curCanvasCellDimensions),
    };
  };

  return {
    canvasCellDimensions,
    canvasWindow,
    canvasNumRowsAndCols,
    canZoomIn:
      (isHeightDetermined ? canvasCellHeight : canvasCellWidth) < MAX_CELL_DIM,
    canZoomOut:
      (isHeightDetermined ? canvasCellHeight : canvasCellWidth) > MIN_CELL_DIM,
    getCoordsFromPixel: (row: number, col: number) => {
      return {
        x: canvasCellDimensions.width * getColPos(col),
        y: canvasCellDimensions.height * getRowPos(row),
      };
    },
    getGridDimensionsFromCell,
    gridDimensions: getGridDimensionsFromCell(canvasCellDimensions),
    resizeCanvas: (
      ref: React.RefObject<HTMLCanvasElement>,
      canvasWidth?: number,
      canvasHeight?: number
    ) => {
      const [gridWidth, gridHeight] = [
        canvasWidth || canvasCellDimensions.width * canvasWindow.visibleCols,
        canvasHeight || canvasCellDimensions.height * canvasWindow.visibleRows,
      ];
      canvasSizingUtils.resizeCanvas({ ref, gridWidth, gridHeight });
    },
    shiftWindow: ({
      newStartRow,
      newStartCol,
      newVisibleRows,
      newVisibleCols,
      updateCanvas,
    }: {
      newStartCol?: number;
      newStartRow?: number;
      newVisibleRows?: number;
      newVisibleCols?: number;
      updateCanvas?: boolean;
    }) => {
      let finalStartRow = newStartRow ?? canvasWindow.startRow;
      let finalStartCol = newStartCol ?? canvasWindow.startCol;
      let finalVisibleRows = newVisibleRows || canvasWindow.visibleRows;
      let finalVisibleCols = newVisibleCols || canvasWindow.visibleCols;

      if (finalVisibleRows > savedCanvasDataRef.current.pixels.length) {
        newVisibleRows = savedCanvasDataRef.current.pixels.length;
      } else if (
        finalStartRow + finalVisibleRows >
        savedCanvasDataRef.current.pixels.length
      ) {
        finalStartRow =
          savedCanvasDataRef.current.pixels.length - finalVisibleRows;
      }

      if (finalVisibleCols > savedCanvasDataRef.current.pixels[0].length) {
        newVisibleCols = savedCanvasDataRef.current.pixels[0].length;
      } else if (
        finalStartCol + finalVisibleCols >
        savedCanvasDataRef.current.pixels[0].length
      ) {
        finalStartCol =
          savedCanvasDataRef.current.pixels[0].length - finalVisibleCols;
      }
      const newWindow = {
        startRow: finalStartRow,
        startCol: finalStartCol,
        visibleRows: finalVisibleRows,
        visibleCols: finalVisibleCols,
      };
      if (
        updateCanvas !== false &&
        (newWindow.startRow !== canvasWindow.startRow ||
          newWindow.startCol !== canvasWindow.startCol ||
          newWindow.visibleRows !== canvasWindow.visibleRows ||
          newWindow.visibleCols !== canvasWindow.visibleCols ||
          updateCanvas === true)
      ) {
        setCanvasWindow(newWindow);
        updateFullCanvas({
          windowTools: {
            canvasWindow: newWindow,
          },
        });
      }

      return newWindow;
    },
    shiftPixelSize,
    recalcGridSize,
  };
}
