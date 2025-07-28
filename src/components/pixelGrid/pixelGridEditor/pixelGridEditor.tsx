"use client";
import Image from "next/image";
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
import useViewboxTools from "@/hooks/pixelGrid/useViewboxTools";
import useEffectWithContainerDimensions from "@/hooks/general/useEffectWithContainerDims";
import usePixelGridSizingTools from "@/hooks/pixelGrid/usePixelGridSizingTools";

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

  const [isHydrated, setHydrated] = useState(false);

  const pixelGridCanvasRefWithRect = useEffectWithContainerDimensions(() => {
    setHydrated(true);
  }, []);

  const [isPointerDownFromCanvas, setPointerDownFromCanvas] = useState(false);

  const updateFullCanvasRef = useRef<
    | ((args: {
        colorCanvasContext?: CanvasRenderingContext2D;
        stitchCanvasContext?: CanvasRenderingContext2D;
        specialShapesCanvasContext?: CanvasRenderingContext2D;
        windowTools?: Partial<PixelGridWindowTools>;
      }) => void)
    | null
  >(null);
  const canvasWindowTools = usePixelGridWindowTools({
    canvasCellWidthHeightRatio:
      savedCanvasData.swatch.width / savedCanvasData.swatch.height,
    pixelGridCanvasRefWithRect,
    canvasNumRowsAndCols: {
      numRows: savedCanvasData.pixels.length,
      numCols: savedCanvasData.pixels[0].length,
    },
    savedCanvasDataRef,
    updateFullCanvas: (...args) => updateFullCanvasRef.current?.(...args),
  });

  const interactionLayerTools = usePixelGridInteractionLayerTools({
    canvasWindowTools,
  });

  const colorCanvasTools = usePixelGridColorCanvasTools({
    canvasWindowTools,
    savedCanvasDataRef: savedCanvasDataRef,
    interactionLayerTools,
  });

  const editConfigTools = usePixelGridEditingConfigTools({
    colorCountTracker: colorCanvasTools.colorCountTracker,
  });

  const gridLineTools = usePixelGridLineCanvasTools({
    canvasWindowTools,
    gridLineColor: editConfigTools.gridLineColor,
  });

  const stitchCanvasTools = usePixelGridStitchCanvasTools({
    canvasWindowTools,
    savedCanvasDataRef,
    interactionLayerTools,
    activeStitchWidthUnit: editConfigTools.stitchWidthUnit,
    gridLineColor: editConfigTools.gridLineColor,
  });

  const specialShapesTools = usePixelGridSpecialShapesCanvasTools({
    canvasWindowTools,
    interactionLayerTools,
  });

  const viewboxTools = useViewboxTools({
    pixelGridCanvasWindowTools: canvasWindowTools,
    savedCanvasDataRef,
    specialShapesRef: specialShapesTools.specialShapesRef,
  });

  const editRecordToolsRef = useRef<ReturnType<
    typeof usePixelGridEditRecordTools
  > | null>(null);
  const gridSizingTools = usePixelGridSizingTools({
    savedCanvasDataRef,
    saveSession: (...args) => editRecordToolsRef.current?.saveSession(...args),
  });

  const updateFullCanvas = ({
    colorCanvasContext,
    stitchCanvasContext,
    specialShapesCanvasContext,
    windowTools,
  }: {
    colorCanvasContext?: CanvasRenderingContext2D;
    stitchCanvasContext?: CanvasRenderingContext2D;
    specialShapesCanvasContext?: CanvasRenderingContext2D;
    windowTools?: Partial<PixelGridWindowTools>;
  }) => {
    const colorCtx =
      colorCanvasContext || (colorCanvasTools.ctx as CanvasRenderingContext2D);
    const stitchCtx =
      stitchCanvasContext ||
      (stitchCanvasTools.ctx as CanvasRenderingContext2D);
    const specialShapesCtx =
      specialShapesCanvasContext ||
      (specialShapesTools.ctx as CanvasRenderingContext2D);
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
            color:
              savedCanvasDataRef.current.pixels[row][col].stitchColor || "#000",
            ctx: stitchCtx,
            windowTools: curCanvasWindowTools,
          });
        }
      }
    }
    specialShapesTools.drawShapesOnCanvas({
      windowTools: curCanvasWindowTools,
      ctx: specialShapesCtx,
    });
  };
  updateFullCanvasRef.current = updateFullCanvas;

  const editRecordTools = usePixelGridEditRecordTools({
    editMode: editConfigTools.editMode,
    savedCanvasDataRef,
    specialShapesRef: specialShapesTools.specialShapesRef,
    updatePixelColor: colorCanvasTools.updatePixelColor,
    stitchCanvasTools: stitchCanvasTools,
    updateFullCanvas,
    viewboxTools,
    drawShapesOnCanvas: specialShapesTools.drawShapesOnCanvas,
    setChangedShapes: specialShapesTools.setChangedShapes,
    canvasWindowTools,
    undoGridSizing: gridSizingTools.undo,
    redoGridSizing: gridSizingTools.redo,
  });
  editRecordToolsRef.current = editRecordTools;

  const canvasEditTools = usePixelGridEditTools({
    colorCanvasTools,
    stitchCanvasTools,
    specialShapesTools,
    editMode: editConfigTools.editMode,
    activeColor:
      editConfigTools.activeColorPalette[editConfigTools.activeColorIdx][0],
    activeStitch:
      editConfigTools.activeStitchPalette[editConfigTools.activeStitchIdx],
    interactionLayerTools,
    editRecordTools,
    activeShapeIdx: editConfigTools.activeShapeIdx,
    stitchColor: editConfigTools.stitchColor,
    shapeColor: editConfigTools.shapeColor,
    stitchWidthUnit: editConfigTools.stitchWidthUnit,
    canvasWindowTools,
  });

  const resizeObserverRef = useRef<null | ResizeObserver>(null);

  // canvas resize
  useEffect(() => {
    resizeObserverRef.current = new ResizeObserver((entries) => {
      for (const _ of entries) {
        const colorCanvasRef =
          colorCanvasTools.ref as React.RefObject<HTMLCanvasElement>;
        const stitchCanvasRef =
          stitchCanvasTools.ref as React.RefObject<HTMLCanvasElement>;
        const gridLineCanvasRef =
          gridLineTools.ref as React.RefObject<HTMLCanvasElement>;
        const specialShapesCanvasRef =
          specialShapesTools.ref as React.RefObject<HTMLCanvasElement>;
        if (
          colorCanvasRef.current &&
          stitchCanvasRef.current &&
          gridLineCanvasRef.current &&
          specialShapesCanvasRef.current
        ) {
          const colorCtx =
            colorCanvasTools.ctx ||
            (colorCanvasRef.current.getContext(
              "2d"
            ) as CanvasRenderingContext2D);
          const stitchCtx =
            stitchCanvasTools.ctx ||
            (stitchCanvasRef.current.getContext(
              "2d"
            ) as CanvasRenderingContext2D);
          const gridLineCtx =
            gridLineTools.ctx ||
            (gridLineCanvasRef.current.getContext(
              "2d"
            ) as CanvasRenderingContext2D);
          const specialShapesCtx =
            specialShapesTools.ctx ||
            (specialShapesCanvasRef.current.getContext(
              "2d"
            ) as CanvasRenderingContext2D);
          const { canvasWindow, gridDimensions } =
            canvasWindowTools.recalcGridSize({});
          if (
            !(
              gridDimensions.width ===
              parseInt(colorCanvasRef.current?.style.width)
            ) ||
            !(
              gridDimensions.height ===
              parseInt(colorCanvasRef.current?.style.height)
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
            canvasWindowTools.resizeCanvas(
              specialShapesCanvasRef,
              gridDimensions.width,
              gridDimensions.height
            );
            updateFullCanvas({
              colorCanvasContext: colorCtx,
              stitchCanvasContext: stitchCtx,
              specialShapesCanvasContext: specialShapesCtx,
              windowTools: { canvasWindow, gridDimensions },
            });
            gridLineTools.drawCanvasLines({
              ctx: gridLineCtx,
              windowTools: { canvasWindow, gridDimensions },
            });
          }
        }
      }
    });
    if (pixelGridCanvasRefWithRect.ref.current) {
      resizeObserverRef.current.observe(pixelGridCanvasRefWithRect.ref.current);
    }
    return () => {
      if (pixelGridCanvasRefWithRect.ref.current) {
        resizeObserverRef.current?.disconnect();
      }
    };
  }, [
    pixelGridCanvasRefWithRect.ref.current,
    canvasWindowTools.canvasCellDimensions.width,
    canvasWindowTools.canvasCellDimensions.height,
    canvasWindowTools.canvasNumRowsAndCols.numRows,
    canvasWindowTools.canvasNumRowsAndCols.numCols,
  ]);

  return (
    <div className="relative flex flex-col h-dvh w-dvw">
      <div className="relative w-screen flex">
        <EditingToolbar
          shiftPixelSize={canvasWindowTools.shiftPixelSize}
          windowTools={canvasWindowTools}
          colorCanvasTools={colorCanvasTools}
          gridLineTools={gridLineTools}
          activeColorPalette={editConfigTools.activeColorPalette}
          activeColorIdx={editConfigTools.activeColorIdx}
          setActiveColorIdx={editConfigTools.setActiveColorIdx}
          setActiveShapeIdx={editConfigTools.setActiveShapeIdx}
          setActiveStitchIdx={editConfigTools.setActiveStitchIdx}
          activeShapePalette={editConfigTools.activeShapePalette}
          activeStitchPalette={editConfigTools.activeStitchPalette}
          swapColorInPalette={editConfigTools.swapColorInPalette}
          activeShapeIdx={editConfigTools.activeShapeIdx}
          activeStitchIdx={editConfigTools.activeStitchIdx}
          editMode={editConfigTools.editMode}
          setEditMode={editConfigTools.setEditMode}
          updateFullCanvas={updateFullCanvas}
          stitchCanvasTools={stitchCanvasTools}
          editRecordTools={editRecordTools}
          savedCanvasDataRef={savedCanvasDataRef}
          specialShapesRef={specialShapesTools.specialShapesRef}
          numberFormat={numberFormat}
          setNumberFormat={setNumberFormat}
          specialShapesTools={specialShapesTools}
          swapStitchInPalette={editConfigTools.swapStitchInPalette}
          stitchColor={editConfigTools.stitchColor}
          setStitchColor={editConfigTools.setStitchColor}
          shapeColor={editConfigTools.shapeColor}
          setShapeColor={editConfigTools.setShapeColor}
          gridLineColor={editConfigTools.gridLineColor}
          setGridLineColor={editConfigTools.setGridLineColor}
        />
      </div>
      <section className="relative w-screen grow flex justify-between touch-manipulation select-none">
        <section className={`card m-2 w-full`}>
          <RowColTracker
            canvasWindow={canvasWindowTools.canvasWindow}
            canvasCellDimensions={canvasWindowTools.canvasCellDimensions}
            canvasNumRowsAndCols={canvasWindowTools.canvasNumRowsAndCols}
            numberFormat={numberFormat}
            pixelGridCanvasRefWithRect={pixelGridCanvasRefWithRect}
            gridSizingTools={gridSizingTools}
          >
            <PixelGridCanvas
              activeShapeIdx={editConfigTools.activeShapeIdx}
              setActiveShapeIdx={editConfigTools.setActiveShapeIdx}
              curPixel={curPixel}
              editMode={editConfigTools.editMode}
              setCurPixel={setCurPixel}
              interactionLayerTools={interactionLayerTools}
              curRow={curRow}
              savedCanvasData={savedCanvasData}
              canvasWindowTools={canvasWindowTools}
              colorCanvasTools={colorCanvasTools}
              gridLineTools={gridLineTools}
              canvasEditTools={canvasEditTools}
              stitchCanvasTools={stitchCanvasTools}
              specialShapesTools={specialShapesTools}
              shapeColor={editConfigTools.shapeColor}
              pixelGridCanvasRefWithRect={pixelGridCanvasRefWithRect}
              isPointerDownFromCanvas={isPointerDownFromCanvas}
              setPointerDownFromCanvas={setPointerDownFromCanvas}
              stitchWidthUnit={editConfigTools.stitchWidthUnit}
            />
          </RowColTracker>
        </section>
        <div
          className={`absolute z-30 w-fit top-2 right-0 flex pointer-events-${
            isPointerDownFromCanvas ? "none" : "auto"
          }`}
        >
          <div
            className="flex items-center"
            style={{
              height: viewboxTools.viewboxDims.height,
            }}
          >
            <button
              onClick={() => viewboxTools.setOpen(!viewboxTools.isOpen)}
              className={`pointer-events-${
                isPointerDownFromCanvas ? "none" : "auto"
              } buttonBlank bg-gray-300 rounded-tr-none rounded-br-none h-10`}
            >
              <Image
                src={`/${
                  viewboxTools.isOpen ? "right" : "left"
                }-line-arrow.svg`}
                alt="hide"
                width={10}
                height={10}
              />
            </button>
          </div>
          <div
            className={`card pointer-events-${
              isPointerDownFromCanvas ? "none" : "auto"
            } bg-gray-300 shadow-none ${
              viewboxTools.isOpen ? "p-1" : "size-0 overflow-hidden p-0"
            }`}
          >
            <ImageViewbox
              savedCanvasDataRef={savedCanvasDataRef}
              canvasWindowTools={canvasWindowTools}
              viewboxTools={viewboxTools}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
