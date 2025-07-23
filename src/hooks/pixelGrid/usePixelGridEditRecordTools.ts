import React, { useRef, useState } from "react";
import { EditMode } from "./usePixelGridEditingConfigTools";
import {
  GridSizeChangeAddSession,
  GridSizeChangeDeleteSession,
  PixelGridCanvasSavedData,
  Session,
  SymbolChangeSessionData,
} from "@/types/pixelGrid";
import { PixelGridWindowTools } from "./usePixelGridWindowTools";
import { SpecialShape } from "./usePixelGridSpecialShapesCanvasTools";
import { ViewboxTools } from "./useViewboxTools";

type Record = Session[];

export type EditRecordTools = {
  addToSession: (row: number, col: number, data: any) => void;
  canRedo: boolean;
  canUndo: boolean;
  saveSession: (instaSession?: Session) => void;
  sessionRef: React.RefObject<Session>;
  undo: () => void;
  redo: () => void;
};

const RECORD_CACHE_SIZE = 7;

export default function usePixelGridEditRecordTools({
  editMode,
  savedCanvasDataRef,
  specialShapesRef,
  updatePixelColor,
  updateStitch,
  viewboxTools,
  drawShapesOnCanvas,
  setChangedShapes,
  updateFullCanvas,
  canvasWindowTools,
  undoGridSizing,
  redoGridSizing,
}: {
  editMode: EditMode;
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  specialShapesRef: React.RefObject<SpecialShape[]>;
  updatePixelColor: ({
    row,
    col,
    hex,
  }: {
    row: number;
    col: number;
    hex: string;
  }) => void;
  updateStitch: ({
    row,
    col,
    stitch,
    color,
    ctx,
    windowTools,
  }: {
    row: number;
    col: number;
    stitch: string;
    color: string;
    ctx?: CanvasRenderingContext2D;
    windowTools?: Partial<PixelGridWindowTools>;
  }) => void;
  viewboxTools: ViewboxTools;
  drawShapesOnCanvas: ({
    windowTools,
    ctx,
  }: {
    windowTools?: Partial<PixelGridWindowTools>;
    ctx?: CanvasRenderingContext2D | null;
  }) => void;
  setChangedShapes: React.Dispatch<React.SetStateAction<number[]>>;
  updateFullCanvas: ({
    colorCanvasContext,
    stitchCanvasContext,
    specialShapesCanvasContext,
    windowTools,
  }: {
    colorCanvasContext?: CanvasRenderingContext2D;
    stitchCanvasContext?: CanvasRenderingContext2D;
    specialShapesCanvasContext?: CanvasRenderingContext2D;
    windowTools?: Partial<PixelGridWindowTools>;
  }) => void;
  canvasWindowTools: PixelGridWindowTools;
  undoGridSizing: (
    session: GridSizeChangeAddSession | GridSizeChangeDeleteSession
  ) => void;
  redoGridSizing: (
    session: GridSizeChangeAddSession | GridSizeChangeDeleteSession
  ) => void;
}): EditRecordTools {
  const sessionRef = useRef<Session>(null);
  const [record, setRecord] = useState<Record>([]);
  const [recordPos, setRecordPos] = useState(0);
  const addToSession = (row: number, col: number, data: any) => {
    let prevData;
    switch (editMode) {
      case "colorChange":
        prevData = savedCanvasDataRef.current.pixels[row][col].hex;
        if (!sessionRef.current || sessionRef.current.mode === "colorChange") {
          sessionRef.current = sessionRef.current || {
            mode: "colorChange",
            data: {},
          };
          sessionRef.current.data[row] = sessionRef.current.data[row] || {};
          sessionRef.current.data[row][col] = {
            prev: prevData,
            new: data,
          };
        }
        break;
      case "symbolChange":
        prevData = {
          stitch: savedCanvasDataRef.current.pixels[row][col].stitch as string,
          stitchColor: savedCanvasDataRef.current.pixels[row][col]
            .stitchColor as string,
        };
        if (!sessionRef.current || sessionRef.current.mode === "symbolChange") {
          sessionRef.current = sessionRef.current || {
            mode: "symbolChange",
            data: {},
          };
          sessionRef.current.data[row] = sessionRef.current.data[row] || {};
          sessionRef.current.data[row][col] = {
            prev: prevData,
            new: { stitch: data.stitch, stitchColor: data.stitchColor },
          };
        }
        break;
      case "specialShapeChange":
        if (data.type === "erase") {
          prevData = data.shape;
          if (
            !sessionRef.current ||
            sessionRef.current.mode === "specialShapeChange"
          ) {
            sessionRef.current = sessionRef.current || {
              mode: "specialShapeChange",
              data: {
                type: "erase",
                prev: [],
                new: null,
              },
            };
            (sessionRef.current.data.prev as [number, SpecialShape][]).push([
              data.shapeId,
              prevData,
            ]);
          }
        } else {
          prevData = specialShapesRef.current?.[data.shapeId].points;
          sessionRef.current = {
            mode: "specialShapeChange",
            data: {
              shapeId: data.shapeId,
              type: data.type,
              prev: prevData,
              color: specialShapesRef.current[data.shapeId].color,
              new: [
                ...prevData.slice(0, data.pointId),
                data.newLoc,
                ...prevData.slice(data.pointId + 1),
              ],
            },
          };
        }
    }
  };

  const saveSession = (instaSession?: Session) => {
    if (sessionRef.current) {
      switch (editMode) {
        case "colorChange":
        case "symbolChange":
          if (
            sessionRef.current.mode === "colorChange" ||
            sessionRef.current.mode === "symbolChange"
          ) {
            for (const [rowIdx, cols] of Object.entries(
              sessionRef.current.data
            )) {
              for (const [colIdx, data] of Object.entries(cols)) {
                switch (sessionRef.current.mode) {
                  case "colorChange":
                    savedCanvasDataRef.current.pixels[parseInt(rowIdx)][
                      parseInt(colIdx)
                    ].hex = data.new;
                    break;
                  case "symbolChange":
                    savedCanvasDataRef.current.pixels[parseInt(rowIdx)][
                      parseInt(colIdx)
                    ].stitch = data.new.stitch;
                    savedCanvasDataRef.current.pixels[parseInt(rowIdx)][
                      parseInt(colIdx)
                    ].stitchColor = data.new.stitchColor;
                }
              }
            }
            if (sessionRef.current.mode === "colorChange") {
              viewboxTools.drawViewboxColors();
            }
          }
          break;
        case "specialShapeChange":
          if (sessionRef.current.mode === "specialShapeChange") {
            if (sessionRef.current.data.type === "erase") {
              viewboxTools.drawViewboxSpecialShapes();
              setChangedShapes([]);
            } else {
              specialShapesRef.current[sessionRef.current.data.shapeId].points =
                sessionRef.current.data.new;
              viewboxTools.drawViewboxSpecialShapes();
            }
          }
      }
    } else if (instaSession) {
      switch (instaSession.mode) {
        case "gridSizeChange":
          sessionRef.current = instaSession;
          const newWindow = canvasWindowTools.shiftWindow({
            updateCanvas: false,
          });
          updateFullCanvas({
            windowTools: {
              canvasWindow: newWindow,
            },
          });
          viewboxTools.updateFullCanvas({
            windowTools: {
              canvasNumRowsAndCols: {
                numRows: savedCanvasDataRef.current.pixels.length,
                numCols: savedCanvasDataRef.current.pixels[0].length,
              },
            },
          });
      }
    }
    if (recordPos === RECORD_CACHE_SIZE) {
      setRecord([...record.slice(1, recordPos), sessionRef.current]);
    } else {
      setRecord([...record.slice(0, recordPos), sessionRef.current]);
      setRecordPos(recordPos + 1);
    }

    sessionRef.current = null;
  };
  const undo = () => {
    const session: Session = record[recordPos - 1];
    if (session) {
      switch (session.mode) {
        case "colorChange":
        case "symbolChange":
          for (const [rowIdx, cols] of Object.entries(session.data)) {
            for (const [colIdx, data] of Object.entries(cols)) {
              switch (session.mode) {
                case "colorChange":
                  savedCanvasDataRef.current.pixels[parseInt(rowIdx)][
                    parseInt(colIdx)
                  ].hex = (data as any).prev;
                  updatePixelColor({
                    row: parseInt(rowIdx),
                    col: parseInt(colIdx),
                    hex: (data as any).prev,
                  });
                  break;
                case "symbolChange":
                  savedCanvasDataRef.current.pixels[parseInt(rowIdx)][
                    parseInt(colIdx)
                  ].stitch = data.prev.stitch;
                  savedCanvasDataRef.current.pixels[parseInt(rowIdx)][
                    parseInt(colIdx)
                  ].stitchColor = data.prev.stitchColor;
                  updateStitch({
                    row: parseInt(rowIdx),
                    col: parseInt(colIdx),
                    stitch: (data as SymbolChangeSessionData).prev.stitch,
                    color:
                      (data as SymbolChangeSessionData).prev.stitchColor ||
                      "#000",
                  });
                  break;
              }
            }
          }
          if (session.mode === "colorChange") {
            viewboxTools.drawViewboxColors();
          }
          break;
        case "specialShapeChange":
          switch (session.data.type) {
            case "update":
              specialShapesRef.current[session.data.shapeId].points =
                session.data.prev;
              break;
            case "create":
              specialShapesRef.current = [
                ...specialShapesRef.current.slice(0, session.data.shapeId),
                ...specialShapesRef.current.slice(session.data.shapeId + 1),
              ];
              break;
            case "erase":
              for (const [shapeId, shape] of session.data.prev.reverse()) {
                specialShapesRef.current = [
                  ...specialShapesRef.current.slice(0, shapeId),
                  shape,
                  ...specialShapesRef.current.slice(shapeId),
                ];
              }
          }
          viewboxTools.drawViewboxSpecialShapes();
          drawShapesOnCanvas({});
          break;
        case "gridSizeChange":
          undoGridSizing(session);
          const newWindow = canvasWindowTools.shiftWindow({
            updateCanvas: false,
          });
          updateFullCanvas({
            windowTools: {
              canvasWindow: newWindow,
            },
          });
          viewboxTools.updateFullCanvas({
            windowTools: {
              canvasNumRowsAndCols: {
                numRows: savedCanvasDataRef.current.pixels.length,
                numCols: savedCanvasDataRef.current.pixels[0].length,
              },
            },
          });
      }

      setRecordPos(recordPos - 1);
    }
  };

  const redo = () => {
    const session: Session = record[recordPos];
    if (session) {
      switch (session.mode) {
        case "colorChange":
        case "symbolChange":
          for (const [rowIdx, cols] of Object.entries(session.data)) {
            for (const [colIdx, data] of Object.entries(cols)) {
              switch (session.mode) {
                case "colorChange":
                  savedCanvasDataRef.current.pixels[parseInt(rowIdx)][
                    parseInt(colIdx)
                  ].hex = (data as any).new;
                  updatePixelColor({
                    row: parseInt(rowIdx),
                    col: parseInt(colIdx),
                    hex: (data as any).new,
                  });
                  break;
                case "symbolChange":
                  savedCanvasDataRef.current.pixels[parseInt(rowIdx)][
                    parseInt(colIdx)
                  ].stitch = (data as any).new.stitch;
                  savedCanvasDataRef.current.pixels[parseInt(rowIdx)][
                    parseInt(colIdx)
                  ].stitchColor = (data as any).new.stitchColor;
                  updateStitch({
                    row: parseInt(rowIdx),
                    col: parseInt(colIdx),
                    stitch: (data as SymbolChangeSessionData).new.stitch,
                    color: (data as SymbolChangeSessionData).new.stitchColor,
                  });
              }
            }
          }
          if (session.mode === "colorChange") {
            viewboxTools.drawViewboxColors();
          }
          break;
        case "specialShapeChange":
          switch (session.data.type) {
            case "update":
              specialShapesRef.current[session.data.shapeId].points =
                session.data.new;
              break;
            case "create":
              specialShapesRef.current = [
                ...specialShapesRef.current.slice(0, session.data.shapeId),
                {
                  shape: "line",
                  color: session.data.color,
                  points: session.data.new,
                },
                ...specialShapesRef.current.slice(session.data.shapeId),
              ];
              break;
            case "erase":
              for (const [shapeId, _] of session.data.prev.reverse()) {
                specialShapesRef.current = [
                  ...specialShapesRef.current.slice(0, shapeId),
                  ...specialShapesRef.current.slice(shapeId + 1),
                ];
              }
          }
          viewboxTools.drawViewboxSpecialShapes();
          drawShapesOnCanvas({});
          break;
        case "gridSizeChange":
          redoGridSizing(session);
          const newWindow = canvasWindowTools.shiftWindow({
            updateCanvas: false,
          });
          updateFullCanvas({
            windowTools: {
              canvasWindow: newWindow,
            },
          });
          viewboxTools.updateFullCanvas({
            windowTools: {
              canvasNumRowsAndCols: {
                numRows: savedCanvasDataRef.current.pixels.length,
                numCols: savedCanvasDataRef.current.pixels[0].length,
              },
            },
          });
      }

      setRecordPos(recordPos + 1);
    }
  };
  return {
    addToSession,
    sessionRef,
    canRedo: recordPos < record.length,
    canUndo: recordPos > 0,
    saveSession,
    undo,
    redo,
  };
}
