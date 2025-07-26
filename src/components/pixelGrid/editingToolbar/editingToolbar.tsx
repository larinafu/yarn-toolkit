import Image from "next/image";

import ColorPicker from "../colorPicker/colorPicker";
import { PixelGridWindowTools } from "@/hooks/pixelGrid/usePixelGridWindowTools";
import { ColorCanvasTools } from "@/hooks/pixelGrid/useColorCanvasTools";
import { PixelGridLineCanvasTools } from "@/hooks/pixelGrid/usePixelGridLineCanvasTools";
import StitchPicker from "../stitchPicker/stitchPicker";
import { StitchCanvasTools } from "@/hooks/pixelGrid/usePixelGridStitchCanvasTools";
import { EditRecordTools } from "@/hooks/pixelGrid/usePixelGridEditRecordTools";
import React, { SetStateAction, useMemo } from "react";
import PixelGridDownloadPreview from "../pixelGridDownloadPreview/pixelGridDownloadPreview";
import FormattingOptions from "../formattingOptions/formattingOptions";
import {
  ActiveColorPalette,
  ActiveShapePalette,
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
import SpecialShapePicker from "../specialShapePicker/specialShapePicker";
import {
  PixelGridSpecialShapesCanvasTools,
  SpecialShape,
} from "@/hooks/pixelGrid/usePixelGridSpecialShapesCanvasTools";
import {
  KNITTING_CABLE_STITCHES,
  KNITTING_STITCHES,
} from "@/constants/pixelGrid/stitches";
import Link from "next/link";

type EditModeIcon = {
  mode: EditMode;
  icon: string;
  color: string;
};

// const execute = () => {
//   function drawTriangle(
//     paddingLeftRight: number,
//     width: number,
//     pos: "top" | "bottom"
//   ): string {
//     const height = 50; // Fixed triangle height in pixels
//     const startX = paddingLeftRight * 100;

//     let baseLeft: number, baseRight: number, apexX: number;
//     let apexY: number, baseY: number;

//     if (pos === "top") {
//       // Upside-down triangle starting from 0
//       baseLeft = 0 + paddingLeftRight * 100;
//       baseRight = baseLeft + width * 100;
//       apexX = baseLeft + (width * 100) / 2;
//       baseY = 0;
//       apexY = height;
//     } else {
//       // Upright triangle starting from paddingLeftRight * 100
//       baseLeft = startX;
//       baseRight = baseLeft + width * 100;
//       apexX = baseLeft + (width * 100) / 2;
//       baseY = height + height; // shifted down by height (50) more
//       apexY = height;
//     }

//     return `M ${baseLeft},${baseY} L ${apexX},${apexY} L ${baseRight},${baseY} Z`;
//   }
//   function drawParallelogram(
//     crossedOver: number,
//     crossingOver: number,
//     direction: "left" | "right"
//   ): string {
//     const crossed = crossedOver * 100;
//     const crossing = crossingOver * 100;
//     const height = 100;

//     let points;

//     if (direction === "right") {
//       // Tilted to the right
//       const A = { x: 0, y: 0 };
//       const B = { x: crossing, y: 0 };
//       const C = { x: crossing + crossed, y: height };
//       const D = { x: crossed, y: height };
//       points = [A, B, C, D];
//     } else {
//       // Tilted to the left
//       const A = { x: crossed, y: 0 };
//       const B = { x: crossed + crossing, y: 0 };
//       const C = { x: crossing, y: height };
//       const D = { x: 0, y: height };
//       points = [A, B, C, D];
//     }

//     return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y} L ${points[2].x},${points[2].y} L ${points[3].x},${points[3].y} Z`;
//   }

//   const map: {
//     [s: string]: {
//       [l: string]: { [p: string]: string };
//     };
//   } = {};
//   for (let i = 1; i < 5; i++) {
//     const spaceRemaining = 9 - i * 2;
//     for (let j = 1; j < spaceRemaining + 1; j++) {
//       map[`${i}/${j}/${i}`] = {
//         left: {},
//         right: {},
//       };
//       map[`${i}/${j}/${i}`]["right"][
//         "reg"
//       ] = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
//       xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 ${
//         (i * 2 + j) * 100
//       } 100"
//       style="enable-background:new 0 0 100 100" xml:space="preserve">
//       <path stroke="#000" fill="#FFF" stroke-width="10" stroke-linecap="round" d="${drawParallelogram(
//         j + i,
//         i,
//         "left"
//       )}" />
//       <path stroke="#000" fill="#FFF" stroke-width="10" stroke-linecap="round" d="${drawParallelogram(
//         j + i,
//         i,
//         "right"
//       )}" />
//           </svg>`;
//       map[`${i}/${j}/${i}`]["right"][
//         "purl"
//       ] = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
//       xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 ${
//         (i * 2 + j) * 100
//       } 100"
//       style="enable-background:new 0 0 100 100" xml:space="preserve">
//       <path stroke="#000" fill="#000" stroke-width="10" stroke-linecap="round" d="${drawTriangle(
//         i,
//         j,
//         "top"
//       )}" />
//       <path stroke="#000" fill="#000" stroke-width="10" stroke-linecap="round" d="${drawTriangle(
//         i,
//         j,
//         "bottom"
//       )}" />
//       <path stroke="#000" fill="#FFF" stroke-width="10" stroke-linecap="round" d="${drawParallelogram(
//         j + i,
//         i,
//         "left"
//       )}" />
//       <path stroke="#000" fill="#FFF" stroke-width="10" stroke-linecap="round" d="${drawParallelogram(
//         j + i,
//         i,
//         "right"
//       )}" />
//           </svg>`;
//       map[`${i}/${j}/${i}`]["left"][
//         "reg"
//       ] = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
//           xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 ${
//             (i * 2 + j) * 100
//           } 100"
//           style="enable-background:new 0 0 100 100" xml:space="preserve">
//           <path stroke="#000" fill="#FFF" stroke-width="10" stroke-linecap="round" d="${drawParallelogram(
//             j + i,
//             i,
//             "right"
//           )}" />
//           <path stroke="#000" fill="#FFF" stroke-width="10" stroke-linecap="round" d="${drawParallelogram(
//             j + i,
//             i,
//             "left"
//           )}" />
//               </svg>`;
//       map[`${i}/${j}/${i}`]["left"][
//         "purl"
//       ] = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
//               xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 ${
//                 (i * 2 + j) * 100
//               } 100"
//               style="enable-background:new 0 0 100 100" xml:space="preserve">
//               <path stroke="#000" fill="#000" stroke-width="10" stroke-linecap="round" d="${drawTriangle(
//                 i,
//                 j,
//                 "top"
//               )}" />
//               <path stroke="#000" fill="#000" stroke-width="10" stroke-linecap="round" d="${drawTriangle(
//                 i,
//                 j,
//                 "bottom"
//               )}" />
//               <path stroke="#000" fill="#FFF" stroke-width="10" stroke-linecap="round" d="${drawParallelogram(
//                 j + i,
//                 i,
//                 "right"
//               )}" />
//               <path stroke="#000" fill="#FFF" stroke-width="10" stroke-linecap="round" d="${drawParallelogram(
//                 j + i,
//                 i,
//                 "left"
//               )}" />
//                   </svg>`;
//     }
//   }
//   return map;
// };

export default function EditingToolbar({
  shiftPixelSize,
  windowTools,
  colorCanvasTools,
  gridLineTools,
  activeColorPalette,
  activeShapePalette,
  activeStitchPalette,
  activeShapeIdx,
  activeStitchIdx,
  swapColorInPalette,
  activeColorIdx,
  setActiveColorIdx,
  setActiveStitchIdx,
  setActiveShapeIdx,
  editMode,
  setEditMode,
  updateFullCanvas,
  stitchCanvasTools,
  specialShapesTools,
  editRecordTools,
  savedCanvasDataRef,
  specialShapesRef,
  numberFormat,
  setNumberFormat,
  swapStitchInPalette,
  stitchColor,
  setStitchColor,
  shapeColor,
  setShapeColor,
  gridLineColor,
  setGridLineColor,
}: {
  shiftPixelSize: (shift: "up" | "down") => {
    canvasWindow: PixelGridCanvasWindow;
    canvasCellDimensions: PixelGridCanvasCellDimensions;
    gridDimensions: PixelGridCanvasCellDimensions;
  };
  windowTools: PixelGridWindowTools;
  colorCanvasTools: ColorCanvasTools;
  gridLineTools: PixelGridLineCanvasTools;
  activeColorPalette: ActiveColorPalette;
  activeShapePalette: ActiveShapePalette;
  activeStitchPalette: ActiveStitchPalette;
  activeShapeIdx: number | "erase" | null;
  activeStitchIdx: number;
  swapColorInPalette: (colorIdx: number, hex: string) => void;
  activeColorIdx: number;
  setActiveColorIdx: React.Dispatch<React.SetStateAction<number>>;
  setActiveShapeIdx: React.Dispatch<
    React.SetStateAction<number | "erase" | null>
  >;
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
  specialShapesRef: React.RefObject<SpecialShape[]>;
  numberFormat: PixelGridNumberFormat;
  setNumberFormat: React.Dispatch<SetStateAction<PixelGridNumberFormat>>;
  specialShapesTools: PixelGridSpecialShapesCanvasTools;
  swapStitchInPalette: (stitchIdx: number, stitch: string) => void;
  stitchColor: string;
  setStitchColor: React.Dispatch<React.SetStateAction<string>>;
  shapeColor: string;
  setShapeColor: React.Dispatch<React.SetStateAction<string>>;
  gridLineColor: string;
  setGridLineColor: React.Dispatch<React.SetStateAction<string>>;
}) {
  const editModeIcons: EditModeIcon[] = [
    {
      mode: "colorChange",
      icon: "/paint.svg",
      color: activeColorPalette[activeColorIdx][0],
    },
    {
      mode: "symbolChange",
      icon: (
        KNITTING_STITCHES[activeStitchPalette[activeStitchIdx]] ||
        KNITTING_CABLE_STITCHES[activeStitchPalette[activeStitchIdx]]
      ).svg,
      color: stitchColor,
    },
    {
      mode: "specialShapeChange",
      icon: "/specialShapes/line.svg",
      color: shapeColor,
    },
  ];

  const activePicker = useMemo(() => {
    switch (editMode) {
      case "colorChange":
        return (
          <ColorPicker
            activeColorPalette={activeColorPalette}
            swapColorInPalette={swapColorInPalette}
            activeColorIdx={activeColorIdx}
            setActiveColorIdx={setActiveColorIdx}
          />
        );
      case "symbolChange":
        return (
          <StitchPicker
            activeStitchPalette={activeStitchPalette}
            activeStitchIdx={activeStitchIdx}
            setActiveStitchIdx={setActiveStitchIdx}
            swapStitchInPalette={swapStitchInPalette}
            stitchColor={stitchColor}
            setStitchColor={setStitchColor}
          />
        );
      case "specialShapeChange":
        return (
          <SpecialShapePicker
            activeShapeIdx={activeShapeIdx}
            activeShapePalette={activeShapePalette}
            setActiveShapeIdx={setActiveShapeIdx}
            shapeColor={shapeColor}
            setShapeColor={setShapeColor}
          />
        );
    }
  }, [
    editMode,
    activeColorIdx,
    activeColorPalette,
    activeStitchIdx,
    activeShapePalette,
    activeShapeIdx,
    activeShapePalette,
    activeStitchPalette,
    stitchColor,
    shapeColor,
  ]);
  return (
    <header className="card grow m-2 p-0 flex justify-center overflow-auto">
      <div className="grow overflow-x-auto">
        <div className="flex align-center">
          <Link
            className="block bg-amaranth p-2 size-fit rounded-2xl m-2"
            href="/"
          >
            <Image src="/logo.jpg" width={30} height={30} alt="exit" />
          </Link>

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
                  if (editModeIcon.mode !== "specialShapeChange") {
                    specialShapesTools.drawShapesOnCanvas({});
                  }
                }}
              >
                <Image
                  src={editModeIcon.icon}
                  alt={editModeIcon.mode}
                  width={20}
                  height={20}
                />
                <div
                  className="w-full h-1 mt-0.5 shadow rounded-2xl"
                  style={{
                    backgroundColor: editModeIcon.color,
                  }}
                ></div>
              </button>
            ))}
          </section>
          <section className="flex items-center shrink-0">
            <FormattingOptions
              numberFormat={numberFormat}
              setNumberFormat={setNumberFormat}
              savedCanvasDataRef={savedCanvasDataRef}
              gridLineColor={gridLineColor}
              setGridLineColor={setGridLineColor}
              gridLineTools={gridLineTools}
            />
            <PixelGridDownloadPreview
              savedCanvasDataRef={savedCanvasDataRef}
              specialShapesRef={specialShapesRef}
              canvasNumRowsAndCols={windowTools.canvasNumRowsAndCols}
              canvasCellWidthHeightRatio={
                savedCanvasDataRef.current.swatch.width /
                savedCanvasDataRef.current.swatch.height
              }
              gridLineColor={gridLineColor}
            />
          </section>
        </div>
        <section className="border-t-amaranth border-t-1 flex justify-around items-center">
          <div className="w-fit">
            <button
              className="buttonBlank p-0 m-1"
              onClick={() => {
                editRecordTools.undo();
              }}
              disabled={!editRecordTools.canUndo}
            >
              <Image
                src={
                  editRecordTools.canUndo ? "/undo.svg" : "/undo-disabled.svg"
                }
                alt="undo"
                height={25}
                width={25}
                priority
              />
            </button>
            <button
              className="buttonBlank p-0 m-1"
              onClick={() => {
                editRecordTools.redo();
              }}
              disabled={!editRecordTools.canRedo}
            >
              <Image
                src={
                  editRecordTools.canRedo ? "/redo.svg" : "/redo-disabled.svg"
                }
                alt="undo"
                height={25}
                width={25}
                priority
              />
            </button>
          </div>
          <div className="overflow-x-auto">{activePicker}</div>
          <section className="">
            <button
              className="buttonBlank p-0 m-1"
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
                canvasSizingUtils.resizeCanvas({
                  ref: specialShapesTools.ref as React.RefObject<HTMLCanvasElement>,
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
                src={`/${
                  windowTools.canZoomOut
                    ? "zoom-out.svg"
                    : "zoom-out-disabled.svg"
                }`}
                alt="zoom out"
                height={20}
                width={20}
              />
            </button>
            <button
              className="buttonBlank p-0 m-1"
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
                canvasSizingUtils.resizeCanvas({
                  ref: specialShapesTools.ref as React.RefObject<any>,
                  gridWidth: gridDimensions.width,
                  gridHeight: gridDimensions.height,
                });
                canvasSizingUtils.resizeCanvas({
                  ref: specialShapesTools.ref as React.RefObject<any>,
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
                src={`/${
                  windowTools.canZoomIn ? "zoom-in.svg" : "zoom-in-disabled.svg"
                }`}
                alt="zoom in"
                height={20}
                width={20}
              />
            </button>
          </section>
        </section>
      </div>
    </header>
  );
}
