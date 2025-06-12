"use client";
import { RefObject, useEffect, useRef, useState } from "react";

import ImageViewbox from "../imageViewbox/imageViewbox";
import { usePathname } from "next/navigation";
import PixelGridCanvas from "../pixelGridCanvas/pixelGridCanvas";

import RowColTracker from "../rowColTracker/rowColTracker";
import usePixelGridWindowTools, {
  PixelGridWindowTools,
} from "@/hooks/pixelGrid/usePixelGridWindowTools";
import usePixelGridColorCanvasTools from "@/hooks/pixelGrid/useColorCanvasTools";
import usePixelGridLineCanvasTools from "@/hooks/pixelGrid/usePixelGridLineCanvasTools";
import usePixelGridEditingConfigTools from "@/hooks/pixelGrid/usePixelGridEditingConfigTools";
import EditingToolbar from "../editingToolbar/editingToolbar";
import {
  PixelGridCanvasSavedData,
  PixelGridNumberFormat,
} from "@/types/pixelGrid";
import usePixelGridInteractionLayerTools, {
  PixelGridInteractionLayerTools,
} from "@/hooks/pixelGrid/usePixelGridInteractionLayerTools";
import usePixelGridEditRecordTools from "@/hooks/pixelGrid/usePixelGridEditRecordTools";
import usePixelGridStitchCanvasTools from "@/hooks/pixelGrid/usePixelGridStitchCanvasTools";
import usePixelGridEditTools from "@/hooks/pixelGrid/usePixelGridEditTools";
import usePixelGridSpecialShapesCanvasTools from "@/hooks/pixelGrid/usePixelGridSpecialShapesCanvasTools";

const MAX_WINDOW_WIDTH_VW = 75;
const MAX_WINDOW_HEIGHT_VH = 75;

export default function PixelGridEditor({
  savedCanvasData,
}: {
  savedCanvasData: PixelGridCanvasSavedData;
}) {
  const projId = usePathname().split("/").pop();

  const [curRow, setCurRow] = useState(0);
  const [curPixel, setCurPixel] = useState([0, 0]);

  const savedCanvasDataRef = useRef(savedCanvasData);

  const [numberFormat, setNumberFormat] = useState<PixelGridNumberFormat>(
    savedCanvasData.numberFormat
  );

  const canvasWindowTools = usePixelGridWindowTools({
    canvasCellWidthHeightRatio:
      savedCanvasData.swatch.width / savedCanvasData.swatch.height,
    maxWindowDimensions: {
      viewWidth: MAX_WINDOW_WIDTH_VW,
      viewHeight: MAX_WINDOW_HEIGHT_VH,
    },
    canvasNumRowsAndCols: {
      numRows: savedCanvasData.pixels.length,
      numCols: savedCanvasData.pixels[0].length,
    },
  });

  const interactionLayerActions = usePixelGridInteractionLayerTools({
    canvasWindowTools,
  });

  const colorCanvasTools = usePixelGridColorCanvasTools({
    canvasWindowTools,
    savedCanvasDataRef: savedCanvasDataRef,
    interactionLayerActions,
  });
  const gridLineTools = usePixelGridLineCanvasTools({
    canvasWindowTools,
  });

  const editConfigTools = usePixelGridEditingConfigTools({
    colorCountTracker: colorCanvasTools.colorCountTracker,
  });

  const stitchCanvasTools = usePixelGridStitchCanvasTools({
    canvasWindowTools,
    interactionLayerActions,
    savedCanvasDataRef,
  });

  const specialShapesTools = usePixelGridSpecialShapesCanvasTools();

  const editRecordTools = usePixelGridEditRecordTools({
    editMode: editConfigTools.editMode,
    savedCanvasDataRef,
    specialShapesRef: specialShapesTools.specialShapesRef,
    updatePixelColor: colorCanvasTools.updatePixelColor,
    updateStitch: stitchCanvasTools.updateStitch,
  });

  const canvasEditTools = usePixelGridEditTools({
    colorCanvasTools,
    stitchCanvasTools,
    specialShapesTools,
    editMode: editConfigTools.editMode,
    activeColor:
      editConfigTools.activeColorPalette[editConfigTools.activeColorIdx][0],
    activeStitch:
      editConfigTools.activeStitchPalette[editConfigTools.activeStitchIdx][0],
    interactionLayerActions,
    savedCanvasDataRef,
    editRecordTools,
  });

  const updateFullCanvas = ({
    colorCanvasContext,
    stitchCanvasContext,
    windowTools,
  }: {
    colorCanvasContext?: CanvasRenderingContext2D;
    stitchCanvasContext?: CanvasRenderingContext2D;
    windowTools?: Partial<PixelGridWindowTools>;
  }) => {
    const colorCtx =
      colorCanvasContext || (colorCanvasTools.ctx as CanvasRenderingContext2D);
    const stitchCtx =
      stitchCanvasContext ||
      (stitchCanvasTools.ctx as CanvasRenderingContext2D);
    const curCanvasWindowTools = {
      ...canvasWindowTools,
      ...windowTools,
    };
    stitchCtx.clearRect(
      0,
      0,
      curCanvasWindowTools.gridDimensions.width,
      curCanvasWindowTools.gridDimensions.height
    );
    for (
      let row = curCanvasWindowTools.canvasWindow.startRow;
      row <
      curCanvasWindowTools.canvasWindow.startRow +
        curCanvasWindowTools.canvasWindow.visibleRows;
      row++
    ) {
      for (
        let col = curCanvasWindowTools.canvasWindow.startCol;
        col <
        curCanvasWindowTools.canvasWindow.startCol +
          curCanvasWindowTools.canvasWindow.visibleCols;
        col++
      ) {
        colorCanvasTools.updatePixelColor({
          row,
          col,
          hex: savedCanvasDataRef.current.pixels[row][col].hex,
          ctx: colorCtx,
          windowTools: curCanvasWindowTools,
        });
        if (savedCanvasDataRef.current.pixels[row][col].stitch) {
          stitchCanvasTools.updateStitch({
            row,
            col,
            stitch: savedCanvasDataRef.current.pixels[row][col]
              .stitch as string,
            color: "#000",
            ctx: stitchCtx,
            windowTools: curCanvasWindowTools,
          });
        }
      }
    }
  };

  // window resize
  useEffect(() => {
    const colorCanvasRef =
      colorCanvasTools.ref as React.RefObject<HTMLCanvasElement>;
    const stitchCanvasRef =
      stitchCanvasTools.ref as React.RefObject<HTMLCanvasElement>;
    const gridLineCanvasRef =
      gridLineTools.ref as React.RefObject<HTMLCanvasElement>;
    const colorCtx =
      colorCanvasTools.ctx ||
      (colorCanvasRef.current.getContext("2d") as CanvasRenderingContext2D);
    const stitchCtx =
      stitchCanvasTools.ctx ||
      (stitchCanvasRef.current.getContext("2d") as CanvasRenderingContext2D);
    const gridLineCtx =
      gridLineTools.ctx ||
      (gridLineCanvasRef.current.getContext("2d") as CanvasRenderingContext2D);
    const handleResize = () => {
      const { canvasWindow, gridDimensions } = canvasWindowTools.recalcGridSize(
        {}
      );
      if (
        !(
          gridDimensions.width === parseInt(colorCanvasRef.current.style.width)
        ) ||
        !(
          gridDimensions.height ===
          parseInt(colorCanvasRef.current.style.height)
        )
      ) {
        canvasWindowTools.resizeCanvas(
          colorCanvasRef,
          gridDimensions.width,
          gridDimensions.height
        );
        canvasWindowTools.resizeCanvas(
          gridLineCanvasRef,
          gridDimensions.width,
          gridDimensions.height
        );
        canvasWindowTools.resizeCanvas(
          stitchCanvasRef,
          gridDimensions.width,
          gridDimensions.height
        );
        updateFullCanvas({
          colorCanvasContext: colorCtx,
          stitchCanvasContext: stitchCtx,
          windowTools: { canvasWindow, gridDimensions },
        });
        gridLineTools.drawCanvasLines({
          ctx: gridLineCtx,
          windowTools: { canvasWindow, gridDimensions },
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    canvasWindowTools.canvasCellDimensions.width,
    canvasWindowTools.canvasCellDimensions.height,
  ]);

  return (
    <>
      <EditingToolbar
        pixelSize={canvasWindowTools.canvasCellDimensions.width}
        shiftPixelSize={canvasWindowTools.shiftPixelSize}
        windowTools={canvasWindowTools}
        colorCanvasTools={colorCanvasTools}
        gridLineTools={gridLineTools}
        activeColorPalette={editConfigTools.activeColorPalette}
        activeColorIdx={editConfigTools.activeColorIdx}
        setActiveColorIdx={editConfigTools.setActiveColorIdx}
        setActiveStitchIdx={editConfigTools.setActiveStitchIdx}
        activeStitchPalette={editConfigTools.activeStitchPalette}
        swapColorInPalette={editConfigTools.swapColorInPalette}
        activeStitchIdx={editConfigTools.activeStitchIdx}
        editMode={editConfigTools.editMode}
        setEditMode={editConfigTools.setEditMode}
        updateFullCanvas={updateFullCanvas}
        stitchCanvasTools={stitchCanvasTools}
        editRecordTools={editRecordTools}
        savedCanvasDataRef={savedCanvasDataRef}
        numberFormat={numberFormat}
        setNumberFormat={setNumberFormat}
      />
      <section className="w-screen flex justify-between touch-manipulation">
        <section className={`card m-2 grow`}>
          <RowColTracker
            canvasWindow={canvasWindowTools.canvasWindow}
            canvasCellDimensions={canvasWindowTools.canvasCellDimensions}
            canvasNumRowsAndCols={canvasWindowTools.canvasNumRowsAndCols}
            numberFormat={numberFormat}
          >
            <PixelGridCanvas
              curPixel={curPixel}
              editMode={editConfigTools.editMode}
              setCurPixel={setCurPixel}
              interactionLayerActions={interactionLayerActions}
              curRow={curRow}
              savedCanvasData={savedCanvasData}
              canvasWindowTools={canvasWindowTools}
              colorCanvasTools={colorCanvasTools}
              gridLineTools={gridLineTools}
              canvasEditTools={canvasEditTools}
              stitchCanvasTools={stitchCanvasTools}
              specialShapesTools={specialShapesTools}
            />
          </RowColTracker>
        </section>
        <div className="flex flex-col w-1/5">
          <ImageViewbox
            savedCanvasDataRef={savedCanvasDataRef}
            canvasWindowTools={canvasWindowTools}
            colorCanvasTools={colorCanvasTools}
            stitchCanvasTools={stitchCanvasTools}
            updateFullCanvas={updateFullCanvas}
          />
        </div>
      </section>
    </>
  );
}
