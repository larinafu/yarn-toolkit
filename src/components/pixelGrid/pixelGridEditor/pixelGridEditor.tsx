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
import Link from "next/link";

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

  const interactionLayerTools = usePixelGridInteractionLayerTools({
    canvasWindowTools,
  });

  const colorCanvasTools = usePixelGridColorCanvasTools({
    canvasWindowTools,
    savedCanvasDataRef: savedCanvasDataRef,
    interactionLayerTools,
  });
  const gridLineTools = usePixelGridLineCanvasTools({
    canvasWindowTools,
  });

  const editConfigTools = usePixelGridEditingConfigTools({
    colorCountTracker: colorCanvasTools.colorCountTracker,
  });

  const stitchCanvasTools = usePixelGridStitchCanvasTools({
    canvasWindowTools,
    interactionLayerTools,
    savedCanvasDataRef,
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

  const editRecordTools = usePixelGridEditRecordTools({
    editMode: editConfigTools.editMode,
    savedCanvasDataRef,
    specialShapesRef: specialShapesTools.specialShapesRef,
    updatePixelColor: colorCanvasTools.updatePixelColor,
    updateStitch: stitchCanvasTools.updateStitch,
    viewboxTools,
    drawShapesOnCanvas: specialShapesTools.drawShapesOnCanvas,
  });

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
            color: "#000",
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

  // window resize
  useEffect(() => {
    const colorCanvasRef =
      colorCanvasTools.ref as React.RefObject<HTMLCanvasElement>;
    const stitchCanvasRef =
      stitchCanvasTools.ref as React.RefObject<HTMLCanvasElement>;
    const gridLineCanvasRef =
      gridLineTools.ref as React.RefObject<HTMLCanvasElement>;
    const specialShapesCanvasRef =
      specialShapesTools.ref as React.RefObject<HTMLCanvasElement>;
    const colorCtx =
      colorCanvasTools.ctx ||
      (colorCanvasRef.current.getContext("2d") as CanvasRenderingContext2D);
    const stitchCtx =
      stitchCanvasTools.ctx ||
      (stitchCanvasRef.current.getContext("2d") as CanvasRenderingContext2D);
    const gridLineCtx =
      gridLineTools.ctx ||
      (gridLineCanvasRef.current.getContext("2d") as CanvasRenderingContext2D);
    const specialShapesCtx =
      specialShapesTools.ctx ||
      (specialShapesCanvasRef.current.getContext(
        "2d"
      ) as CanvasRenderingContext2D);
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
      <Link className="buttonBlank" href="/">
        <Image src="/leave.svg" width={30} height={30} alt="exit" />
      </Link>
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
      />
      <section className="w-screen flex justify-between touch-manipulation select-none">
        <section className={`card m-2 grow`}>
          <RowColTracker
            canvasWindow={canvasWindowTools.canvasWindow}
            canvasCellDimensions={canvasWindowTools.canvasCellDimensions}
            canvasNumRowsAndCols={canvasWindowTools.canvasNumRowsAndCols}
            numberFormat={numberFormat}
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
            />
          </RowColTracker>
        </section>
        <div className="w-1/5">
          <ImageViewbox
            savedCanvasDataRef={savedCanvasDataRef}
            canvasWindowTools={canvasWindowTools}
            updateFullCanvas={updateFullCanvas}
            viewboxTools={viewboxTools}
          />
        </div>
      </section>
    </>
  );
}
