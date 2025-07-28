import React, { useRef, useState } from "react";
import { PixelGridWindowTools } from "./usePixelGridWindowTools";
import { PixelGridInteractionLayerTools } from "./usePixelGridInteractionLayerTools";
import {
  isSvgPath,
  PixelGridCanvasSavedData,
  SvgPath,
} from "@/types/pixelGrid";
import {
  KNITTING_CABLE_STITCHES,
  KNITTING_STITCHES,
} from "@/constants/pixelGrid/stitches";
import {
  getStitchWidthUnitsFromId,
  isCable,
} from "@/utils/general/stitchUtils";

export type StitchCanvasTools = {
  ctx: CanvasRenderingContext2D | null;
  setCtx: React.Dispatch<React.SetStateAction<CanvasRenderingContext2D | null>>;
  ref: React.RefObject<HTMLCanvasElement | null>;
  updateFullCanvas: (args?: {
    windowTools?: Partial<PixelGridWindowTools>;
  }) => void;
  updateStitch: ({
    row,
    col,
    stitch,
    color,
    ctx,
    windowTools,
    config,
  }: {
    row: number;
    col: number;
    stitch: string | undefined;
    color: string;
    ctx?: CanvasRenderingContext2D;
    windowTools?: Partial<PixelGridWindowTools>;
    config?: {
      affectedColsInterval?: {
        startCol?: number;
        endCol?: number;
      };
      stitchWidthUnit?: number;
    };
  }) => { affectedColsStart: number; affectedColsEnd: number };
  findCableStitchStartingPos: (
    curRow: number,
    curCol: number
  ) => { cableStartingRow: number; cableStartingCol: number; stitch: string };
};

export default function usePixelGridStitchCanvasTools({
  canvasWindowTools,
  savedCanvasDataRef,
  interactionLayerTools,
  activeStitchWidthUnit,
}: {
  canvasWindowTools: PixelGridWindowTools;
  interactionLayerTools: PixelGridInteractionLayerTools;
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  activeStitchWidthUnit: number;
}): StitchCanvasTools {
  const stitchCanvasRef = useRef(null);
  const [stitchCanvasContext, setStitchCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

  const findCableStitchStartingPos = (curRow: number, curCol: number) => {
    let curCell = savedCanvasDataRef.current.pixels[curRow][curCol];
    while (!(curCell.stitch && isCable(curCell.stitch))) {
      curCell = savedCanvasDataRef.current.pixels[curRow][curCol - 1];
    }
    return {
      cableStartingRow: curRow,
      cableStartingCol: curCol,
      stitch: curCell.stitch,
    };
  };

  const drawStitchPathStep = (
    x: number,
    y: number,
    svgPathStep: SvgPath,
    context: CanvasRenderingContext2D,
    windowTools: PixelGridWindowTools
  ) => {
    context.lineWidth = 2;
    context.lineJoin = "round";
    context.lineCap = "round";
    if (svgPathStep[1] === "stroke") {
      context.stroke(
        createFromSvgPath(
          x,
          y,
          windowTools.canvasCellDimensions.width,
          windowTools.canvasCellDimensions.height,
          svgPathStep[0]
        )
      );
    } else {
      context.fill(
        createFromSvgPath(
          x,
          y,
          windowTools.canvasCellDimensions.width,
          windowTools.canvasCellDimensions.height,
          svgPathStep[0]
        )
      );
    }
  };

  const drawCableStitch = (
    x: number,
    y: number,
    stitch: string,
    context: CanvasRenderingContext2D,
    windowTools: PixelGridWindowTools
  ) => {
    const stitchWidthUnit = getStitchWidthUnitsFromId(stitch);
    context.fillStyle = "white";
    context.fillRect(
      x,
      y,
      windowTools.canvasCellDimensions.width * stitchWidthUnit,
      canvasWindowTools.canvasCellDimensions.height
    );
    context.strokeRect(
      x,
      y,
      windowTools.canvasCellDimensions.width * stitchWidthUnit,
      canvasWindowTools.canvasCellDimensions.height
    );
    const svgPaths = KNITTING_CABLE_STITCHES[stitch].svgPaths;
    context.strokeStyle = "#000";
    context.lineWidth = 2;
    context.lineJoin = "round";
    context.lineCap = "round";

    for (const svgPath of svgPaths) {
      context.fillStyle = svgPath[1];
      const path = createCableFromSvgPath(
        x,
        y,
        windowTools.canvasCellDimensions.width,
        windowTools.canvasCellDimensions.height,
        svgPath[0]
      );
      context.fill(path);
      context.stroke(path);
    }
    context.strokeStyle = "gray";
    context.strokeRect(
      x,
      y,
      windowTools.canvasCellDimensions.width * stitchWidthUnit,
      canvasWindowTools.canvasCellDimensions.height
    );
  };

  const getEraseInterval = (
    row: number,
    col: number,
    config?: {
      stitchWithUnit?: number;
    }
  ) => {
    let curColPos = col;
    let eraseStart = col;
    while (
      curColPos <
      Math.min(
        canvasWindowTools.canvasNumRowsAndCols.numCols,
        col + (config?.stitchWithUnit ?? activeStitchWidthUnit)
      )
    ) {
      let colStartPos = curColPos;
      while (
        colStartPos > 0 &&
        savedCanvasDataRef.current.pixels[row][colStartPos].isPartOfCable &&
        !savedCanvasDataRef.current.pixels[row][colStartPos].stitch
      ) {
        colStartPos -= 1;
      }
      eraseStart = Math.min(eraseStart, colStartPos);
      curColPos =
        colStartPos +
        (isCable(savedCanvasDataRef.current.pixels[row][colStartPos].stitch)
          ? getStitchWidthUnitsFromId(
              savedCanvasDataRef.current.pixels[row][colStartPos]
                .stitch as string
            )
          : 1);
    }
    return {
      startCol: eraseStart,
      endCol: curColPos,
    };
  };

  const updateStitch = ({
    row,
    col,
    stitch,
    color,
    ctx,
    windowTools,
    config,
  }: {
    row: number;
    col: number;
    stitch?: string;
    color: string;
    ctx?: CanvasRenderingContext2D;
    windowTools?: Partial<PixelGridWindowTools>;
    config?: {
      affectedColsInterval?: {
        startCol?: number;
        endCol?: number;
      };
      stitchWidthUnit?: number;
    };
  }) => {
    const context = ctx || (stitchCanvasContext as CanvasRenderingContext2D);
    context.strokeStyle = color;
    context.fillStyle = color;
    const curCanvasWindowTools = {
      ...canvasWindowTools,
      ...windowTools,
    };
    const { startCol: colEraseStart, endCol: colEraseEnd } = {
      ...getEraseInterval(row, col),
      ...config?.affectedColsInterval,
    };

    const stitchWidthUnit = colEraseEnd - colEraseStart;

    const { x: startColClearX } = interactionLayerTools.getXYCoordsFromPixelPos(
      {
        row,
        col: colEraseStart,
        windowTools: curCanvasWindowTools,
      }
    );

    const { x, y } = interactionLayerTools.getXYCoordsFromPixelPos({
      row,
      col,
      windowTools: curCanvasWindowTools,
    });

    context.clearRect(
      startColClearX,
      y,
      curCanvasWindowTools.canvasCellDimensions.width * stitchWidthUnit,
      curCanvasWindowTools.canvasCellDimensions.height
    );
    if (stitch) {
      if (isCable(stitch)) {
        drawCableStitch(x, y, stitch, context, curCanvasWindowTools);
      } else {
        const svgPathSteps = KNITTING_STITCHES[stitch].svgPaths;
        if (isSvgPath(svgPathSteps)) {
          drawStitchPathStep(x, y, svgPathSteps, context, curCanvasWindowTools);
        } else {
          for (const svgPathStep of svgPathSteps) {
            drawStitchPathStep(
              x,
              y,
              svgPathStep,
              context,
              curCanvasWindowTools
            );
          }
        }
      }
    }
    return { affectedColsStart: colEraseStart, affectedColsEnd: colEraseEnd };
  };

  const updateFullCanvas = (args?: {
    windowTools?: Partial<PixelGridWindowTools>;
  }) => {
    const curWindowTools = {
      ...canvasWindowTools,
      ...args?.windowTools,
    };
    if (stitchCanvasContext) {
      stitchCanvasContext.clearRect(
        0,
        0,
        curWindowTools.gridDimensions.width,
        curWindowTools.gridDimensions.height
      );
    }
    for (
      let row = curWindowTools.canvasWindow.startRow;
      row <
      curWindowTools.canvasWindow.startRow +
        curWindowTools.canvasWindow.visibleRows;
      row++
    ) {
      for (
        let col = curWindowTools.canvasWindow.startCol;
        col <
        curWindowTools.canvasWindow.startCol +
          curWindowTools.canvasWindow.visibleCols;
        col++
      ) {
        if (savedCanvasDataRef.current.pixels[row][col].stitch) {
          updateStitch({
            row,
            col,
            stitch: savedCanvasDataRef.current.pixels[row][col]
              .stitch as string,
            color:
              savedCanvasDataRef.current.pixels[row][col].stitchColor || "#000",
            windowTools: curWindowTools,
          });
        }
      }
    }
  };

  return {
    ctx: stitchCanvasContext,
    setCtx: setStitchCanvasContext,
    ref: stitchCanvasRef,
    updateStitch,
    findCableStitchStartingPos,
    updateFullCanvas,
  };
}

export const createFromSvgPath = (
  x: number,
  y: number,
  width: number,
  height: number,
  d: string
) => {
  const path = new Path2D();
  const mat = new DOMMatrix();
  mat.translateSelf(x + width * 0.1, y + height * 0.1);
  mat.scaleSelf((width / 100) * 0.8, (height / 100) * 0.8, 1);
  path.addPath(new Path2D(d), mat);
  return path;
};

export const createCableFromSvgPath = (
  x: number,
  y: number,
  width: number,
  height: number,
  d: string
) => {
  const path = new Path2D();
  const mat = new DOMMatrix();
  mat.translateSelf(x + width / 100, y + height / 100);
  mat.scaleSelf(width / 100, height / 100, 1);
  path.addPath(new Path2D(d), mat);
  return path;
};
