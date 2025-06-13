import { useRef, useState } from "react";
import { EditMode } from "./usePixelGridEditingConfigTools";
import { PixelGridCanvasSavedData } from "@/types/pixelGrid";
import { PixelGridWindowTools } from "./usePixelGridWindowTools";
import { Point, SpecialShape } from "./usePixelGridSpecialShapesCanvasTools";

type Session =
  | null
  | {
      mode: "colorChange" | "symbolChange";
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
      mode: "specialShapeChange";
      data: {
        shapeId: number;
        type: "create" | "update";
        prev: Point[];
        new: Point[];
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
}): EditRecordTools {
  const sessionRef = useRef<Session>(null);
  const recordRef = useRef<Record>([]);
  const [recordPos, setRecordPos] = useState(0);
  console.log(recordRef);
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
        prevData = savedCanvasDataRef.current.pixels[row][col].stitch as string;
        if (!sessionRef.current || sessionRef.current.mode === "symbolChange") {
          sessionRef.current = sessionRef.current || {
            mode: "symbolChange",
            data: {},
          };
          sessionRef.current.data[row] = sessionRef.current.data[row] || {};
          sessionRef.current.data[row][col] = {
            prev: prevData,
            new: data,
          };
        }
        break;
      case "specialShapeChange":
        prevData = specialShapesRef.current[data.shapeId].points;
        sessionRef.current = {
          mode: "specialShapeChange",
          data: {
            shapeId: data.shapeId,
            type: data.type,
            prev: prevData,
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
    switch (editMode) {
      case "colorChange":
      case "symbolChange":
        if (
          sessionRef.current &&
          (sessionRef.current.mode === "colorChange" ||
            sessionRef.current.mode === "symbolChange")
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
                  ].stitch = data.new;
              }
            }
          }
        }
        break;
      case "specialShapeChange":
        if (
          sessionRef.current &&
          sessionRef.current.mode === "specialShapeChange"
        ) {
          specialShapesRef.current[sessionRef.current.data.shapeId].points =
            sessionRef.current.data.new;
        }
    }

    recordRef.current = recordRef.current.slice(0, recordPos);
    if (recordRef.current.length === RECORD_CACHE_SIZE) {
      recordRef.current = recordRef.current.slice(1, recordPos);
    }
    recordRef.current.push(sessionRef.current);
    setRecordPos(recordRef.current.length);
    sessionRef.current = null;
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
                  ].stitch = (data as any).prev;
                  updateStitch({
                    row: parseInt(rowIdx),
                    col: parseInt(colIdx),
                    stitch: (data as any).prev,
                    color: "#000",
                  });
                  break;
              }
            }
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
                  ].stitch = (data as any).new;
                  updateStitch({
                    row: parseInt(rowIdx),
                    col: parseInt(colIdx),
                    stitch: (data as any).new,
                    color: "#000",
                  });
              }
            }
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
                  points: session.data.new,
                },
                ...specialShapesRef.current.slice(session.data.shapeId),
              ];
          }
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
