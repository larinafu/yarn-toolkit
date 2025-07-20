import { DEFAULT_CELL_COLOR } from "@/constants/colors";
import {
  PixelGridCanvasCell,
  PixelGridCanvasSavedData,
} from "@/types/pixelGrid";
import { Session } from "./usePixelGridEditRecordTools";

export type GridSizingTools = {
  deleteRow: (rowIdx: number) => void;
  deleteCol: (colIdx: number) => void;
  addRow: (rowIdx: number, pos: "top" | "bottom") => void;
  addCol: (colIdx: number, pos: "left" | "right") => void;
};

export default function usePixelGridSizingTools({
  savedCanvasDataRef,
  saveSession,
}: {
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  saveSession: (instaSession?: Session) => void;
}): GridSizingTools {
  const deleteRow = (rowIdx: number) => {
    const deletedRow = savedCanvasDataRef.current.pixels[rowIdx];
    savedCanvasDataRef.current.pixels.splice(rowIdx, 1);
    saveSession({
      mode: "gridSizeChange",
      data: {
        action: "delete",
        gridLayer: "row",
        idx: rowIdx,
        layer: deletedRow,
      },
    });
  };

  const deleteCol = (colIdx: number) => {
    const deletedCol: PixelGridCanvasCell[] = [];
    for (const row of savedCanvasDataRef.current.pixels) {
      deletedCol.push(row.splice(colIdx, 1)[0]);
    }
    saveSession({
      mode: "gridSizeChange",
      data: {
        action: "delete",
        gridLayer: "col",
        idx: colIdx,
        layer: deletedCol,
      },
    });
  };

  const addRow = (rowIdx: number, pos: "top" | "bottom") => {
    const insertIndex = pos === "top" ? rowIdx : rowIdx + 1;
    savedCanvasDataRef.current.pixels.splice(
      insertIndex,
      0,
      new Array(savedCanvasDataRef.current.pixels[0].length).fill({
        hex: DEFAULT_CELL_COLOR,
      })
    );
    saveSession({
      mode: "gridSizeChange",
      data: {
        action: "add",
        gridLayer: "row",
        idx: insertIndex,
      },
    });
  };

  const addCol = (colIdx: number, pos: "left" | "right") => {
    const insertIdx = pos === "left" ? colIdx : colIdx + 1;
    for (let i = 0; i < savedCanvasDataRef.current.pixels.length; i++) {
      savedCanvasDataRef.current.pixels[i].splice(insertIdx, 0, {
        hex: DEFAULT_CELL_COLOR,
      });
    }
    saveSession({
      mode: "gridSizeChange",
      data: {
        action: "add",
        gridLayer: "col",
        idx: insertIdx,
      },
    });
  };

  const undo = () => {};
  const redo = () => {};
  return {
    addRow,
    addCol,
    deleteRow,
    deleteCol,
  };
}
