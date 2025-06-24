import { useRef, useState } from "react";
import { EditMode } from "./usePixelGridEditingConfigTools";
import { PixelGridCanvasSavedData } from "@/types/pixelGrid";
import { PixelGridWindowTools } from "./usePixelGridWindowTools";
import { Point, SpecialShape } from "./usePixelGridSpecialShapesCanvasTools";
import { ViewboxTools } from "./useViewboxTools";

type SymbolChangeSessionData = {
  prev: { stitch: string; stitchColor: string };
  new: { stitch: string; stitchColor: string };
};

type Session =
  | null
  | {
      mode: "colorChange";
      data: {
        [row: number]: {
          [col: number]: {
            prev: any;
            new: any;
          };
        };
      };
    }
  | {
      mode: "symbolChange";
      data: {
        [row: number]: {
          [col: number]: SymbolChangeSessionData;
        };
      };
    }
  | {
      mode: "specialShapeChange";
      data: {
        shapeId: number;
        type: "create" | "update";
        prev: Point[];
        new: Point[];
        color: string;
      };
    };

type Record = Session[];

export type EditRecordTools = {
  addToSession: (row: number, col: number, data: any) => void;
  canRedo: boolean;
  canUndo: boolean;
  saveSession: () => void;
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
}): EditRecordTools {
  const sessionRef = useRef<Session>(null);
  const recordRef = useRef<Record>([]);
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
  };

  const saveSession = () => {
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
            specialShapesRef.current[sessionRef.current.data.shapeId].points =
              sessionRef.current.data.new;
            viewboxTools.drawViewboxSpecialShapes();
          }
      }
      recordRef.current = recordRef.current.slice(0, recordPos);
      if (recordRef.current.length === RECORD_CACHE_SIZE) {
        recordRef.current = recordRef.current.slice(1, recordPos);
      }
      recordRef.current.push(sessionRef.current);
      setRecordPos(recordRef.current.length);
      sessionRef.current = null;
    }
  };
  const undo = () => {
    const session: Session = recordRef.current[recordPos - 1];
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
          }
          viewboxTools.drawViewboxSpecialShapes();
          drawShapesOnCanvas({});
      }

      setRecordPos(recordPos - 1);
    }
  };

  const redo = () => {
    const session: Session = recordRef.current[recordPos];
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
          }
          viewboxTools.drawViewboxSpecialShapes();
          drawShapesOnCanvas({});
      }

      setRecordPos(recordPos + 1);
    }
  };
  return {
    addToSession,
    sessionRef,
    canRedo: recordPos < recordRef.current.length,
    canUndo: recordPos > 0,
    saveSession,
    undo,
    redo,
  };
}
