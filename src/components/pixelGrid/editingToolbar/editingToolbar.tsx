import Image from "next/image";

import styles from "./editingToolbar.module.css";
import ColorPicker from "../colorPicker/colorPicker";
import { PixelGridWindowTools } from "@/hooks/pixelGrid/usePixelGridWindowTools";
import { ColorCanvasTools } from "@/hooks/pixelGrid/useColorCanvasTools";
import { PixelGridLineCanvasTools } from "@/hooks/pixelGrid/usePixelGridLineCanvasTools";
import StitchPicker from "../stitchPicker/stitchPicker";
import { StitchCanvasTools } from "@/hooks/pixelGrid/usePixelGridStitchCanvasTools";
import { EditRecordTools } from "@/hooks/pixelGrid/usePixelGridEditRecordTools";
import React, { SetStateAction } from "react";
import PixelGridDownloadPreview from "../pixelGridDownloadPreview/pixelGridDownloadPreview";
import FormattingOptions from "../formattingOptions/formattingOptions";
import {
  ActiveColorPalette,
  ActiveStitchPalette,
  EditMode,
} from "@/hooks/pixelGrid/usePixelGridEditingConfigTools";
import {
  PixelGridCanvasCellDimensions,
  PixelGridCanvasSavedData,
  PixelGridCanvasWindow,
  PixelGridNumberFormat,
} from "@/types/pixelGrid";
import canvasSizingUtils from "@/utils/pixelGrid/canvasSizingUtils";

type EditModeIcon = {
  mode: EditMode;
  icon: string;
  color: string;
};

export default function EditingToolbar({
  pixelSize,
  shiftPixelSize,
  windowTools,
  colorCanvasTools,
  gridLineTools,
  activeColorPalette,
  activeStitchPalette,
  activeStitchIdx,
  swapColorInPalette,
  activeColorIdx,
  setActiveColorIdx,
  setActiveStitchIdx,
  editMode,
  setEditMode,
  updateFullCanvas,
  stitchCanvasTools,
  editRecordTools,
  savedCanvasDataRef,
  numberFormat,
  setNumberFormat,
}: {
  pixelSize: number;
  shiftPixelSize: (shift: "up" | "down") => {
    canvasWindow: PixelGridCanvasWindow;
    canvasCellDimensions: PixelGridCanvasCellDimensions;
    gridDimensions: PixelGridCanvasCellDimensions;
  };
  windowTools: PixelGridWindowTools;
  colorCanvasTools: ColorCanvasTools;
  gridLineTools: PixelGridLineCanvasTools;
  activeColorPalette: ActiveColorPalette;
  activeStitchPalette: ActiveStitchPalette;
  activeStitchIdx: number;
  swapColorInPalette: (colorIdx: number, hex: string) => void;
  activeColorIdx: number;
  setActiveColorIdx: React.Dispatch<React.SetStateAction<number>>;
  setActiveStitchIdx: React.Dispatch<React.SetStateAction<number>>;
  editMode: EditMode;
  setEditMode: React.Dispatch<React.SetStateAction<EditMode>>;
  stitchCanvasTools: StitchCanvasTools;
  updateFullCanvas: ({
    colorCanvasContext,
    stitchCanvasContext,
    windowTools,
  }: {
    colorCanvasContext?: CanvasRenderingContext2D;
    stitchCanvasContext?: CanvasRenderingContext2D;
    windowTools?: Partial<PixelGridWindowTools>;
  }) => void;
  editRecordTools: EditRecordTools;
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  numberFormat: PixelGridNumberFormat;
  setNumberFormat: React.Dispatch<SetStateAction<PixelGridNumberFormat>>;
}) {
  const editModeIcons: EditModeIcon[] = [
    {
      mode: "colorChange",
      icon: "/pixelGridEditor/pen.svg",
      color: activeColorPalette[activeColorIdx][0],
    },
    {
      mode: "symbolChange",
      icon: activeStitchPalette[activeStitchIdx][1],
      color: "#000",
    },
    {
      mode: "specialShapeChange",
      icon: "/specialShapes/line.svg",
      color: "#000",
    },
  ];
  return (
    <section className="flex justify-center mt-1">
      <header className={`card mg-0-auto w-fit-content pd-0`}>
        <div className="flex align-center">
          <button
            className="buttonBlank pd-xxs"
            onClick={() => {
              editRecordTools.undo();
            }}
            disabled={!editRecordTools.canUndo}
          >
            <Image
              src={editRecordTools.canUndo ? "/undo.svg" : "/undo-disabled.svg"}
              alt="undo"
              height={25}
              width={25}
              priority
            />
          </button>
          <button
            className="buttonBlank p-0.5"
            onClick={() => {
              editRecordTools.redo();
            }}
            disabled={!editRecordTools.canRedo}
          >
            <Image
              src={editRecordTools.canRedo ? "/redo.svg" : "/redo-disabled.svg"}
              alt="undo"
              height={25}
              width={25}
              priority
            />
          </button>
          <section className="flex justify-center m-auto mt-0 mb-0">
            {editModeIcons.map((editModeIcon) => (
              <button
                key={editModeIcon.mode}
                className={`buttonBlank p-0.5 relative m-0.5 ${
                  editModeIcon.mode === editMode
                    ? "bg-amaranth-light rounded-xs hover:bg-amaranth-light hover:rounded-xs"
                    : ""
                }`}
                onClick={() => {
                  setEditMode(editModeIcon.mode);
                }}
              >
                <Image
                  src={editModeIcon.icon}
                  alt={editModeIcon.mode}
                  width={20}
                  height={20}
                />
                <div
                  className={styles.colorLinePreview}
                  style={{
                    backgroundColor: editModeIcon.color,
                  }}
                ></div>
              </button>
            ))}
          </section>
          <section className="flex justify-center items-center">
            <button
              className="buttonBlank ml-2 mr-2"
              onClick={() => {
                const { canvasWindow, canvasCellDimensions, gridDimensions } =
                  shiftPixelSize("down");
                canvasSizingUtils.resizeCanvas({
                  ref: colorCanvasTools.ref as React.RefObject<HTMLCanvasElement>,
                  gridWidth: gridDimensions.width,
                  gridHeight: gridDimensions.height,
                });
                canvasSizingUtils.resizeCanvas({
                  ref: stitchCanvasTools.ref as React.RefObject<HTMLCanvasElement>,
                  gridWidth: gridDimensions.width,
                  gridHeight: gridDimensions.height,
                });
                updateFullCanvas({
                  windowTools: {
                    canvasCellDimensions,
                    canvasWindow,
                    gridDimensions,
                  },
                });
                canvasSizingUtils.resizeCanvas({
                  ref: gridLineTools.ref as React.RefObject<HTMLCanvasElement>,
                  gridWidth: gridDimensions.width,
                  gridHeight: gridDimensions.height,
                });
                gridLineTools.drawCanvasLines({
                  windowTools: {
                    canvasCellDimensions,
                    canvasWindow,
                    gridDimensions,
                  },
                });
              }}
              disabled={!windowTools.canZoomOut}
            >
              <Image
                src={"/zoom-out.svg"}
                alt="zoom out"
                height={20}
                width={20}
              />
            </button>
            <button
              className="buttonBlank ml-2 mr-2"
              onClick={() => {
                const { canvasWindow, canvasCellDimensions, gridDimensions } =
                  shiftPixelSize("up");
                canvasSizingUtils.resizeCanvas({
                  ref: colorCanvasTools.ref as React.RefObject<any>,
                  gridWidth: gridDimensions.width,
                  gridHeight: gridDimensions.height,
                });
                canvasSizingUtils.resizeCanvas({
                  ref: stitchCanvasTools.ref as React.RefObject<any>,
                  gridWidth: gridDimensions.width,
                  gridHeight: gridDimensions.height,
                });
                updateFullCanvas({
                  windowTools: {
                    canvasCellDimensions,
                    canvasWindow,
                    gridDimensions,
                  },
                });
                canvasSizingUtils.resizeCanvas({
                  ref: gridLineTools.ref as React.RefObject<HTMLCanvasElement>,
                  gridWidth: gridDimensions.width,
                  gridHeight: gridDimensions.height,
                });
                gridLineTools.drawCanvasLines({
                  windowTools: {
                    canvasCellDimensions,
                    canvasWindow,
                    gridDimensions,
                  },
                });
              }}
              disabled={!windowTools.canZoomIn}
            >
              <Image
                src={"/zoom-in.svg"}
                alt="zoom in"
                height={20}
                width={20}
              />
            </button>
          </section>
        </div>
        <section className="border-t-amaranth border-t-1">
          {editMode === "colorChange" ? (
            <ColorPicker
              activeColorPalette={activeColorPalette}
              swapColorInPalette={swapColorInPalette}
              activeColorIdx={activeColorIdx}
              setActiveColorIdx={setActiveColorIdx}
            />
          ) : (
            <StitchPicker
              activeStitchPalette={activeStitchPalette}
              activeStitchIdx={activeStitchIdx}
              setActiveStitchIdx={setActiveStitchIdx}
            />
          )}
        </section>
      </header>
      <FormattingOptions
        numberFormat={numberFormat}
        setNumberFormat={setNumberFormat}
        savedCanvasDataRef={savedCanvasDataRef}
      />
      <PixelGridDownloadPreview
        savedCanvasDataRef={savedCanvasDataRef}
        canvasNumRowsAndCols={windowTools.canvasNumRowsAndCols}
        canvasCellWidthHeightRatio={
          savedCanvasDataRef.current.swatch.width /
          savedCanvasDataRef.current.swatch.height
        }
      />
    </section>
  );
}
