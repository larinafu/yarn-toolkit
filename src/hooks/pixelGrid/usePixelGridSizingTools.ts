import { DEFAULT_CELL_COLOR } from "@/constants/colors";
import {
  GridSizeChangeAddSession,
  GridSizeChangeDeleteSession,
  PixelGridCanvasCell,
  PixelGridCanvasSavedData,
} from "@/types/pixelGrid";

export type GridSizingTools = {
  deleteRow: (rowIdx: number, config?: { noSessionAdd?: boolean }) => void;
  deleteCol: (colIdx: number, config?: { noSessionAdd?: boolean }) => void;
  addRow: (
    rowIdx: number,
    pos: "top" | "bottom",
    config?: { noSessionAdd?: boolean; row?: PixelGridCanvasCell[] }
  ) => void;
  addCol: (
    colIdx: number,
    pos: "left" | "right",
    config?: { noSessionAdd?: boolean; col?: PixelGridCanvasCell[] }
  ) => void;
  undo: (
    session: GridSizeChangeAddSession | GridSizeChangeDeleteSession
  ) => void;
  redo: (
    session: GridSizeChangeAddSession | GridSizeChangeDeleteSession
  ) => void;
};

export default function usePixelGridSizingTools({
  savedCanvasDataRef,
  saveSession,
}: {
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  saveSession: (
    instaSession?: GridSizeChangeAddSession | GridSizeChangeDeleteSession
  ) => void;
}): GridSizingTools {
  const deleteRow = (rowIdx: number, config?: { noSessionAdd?: boolean }) => {
    const deletedRow = savedCanvasDataRef.current.pixels[rowIdx];
    savedCanvasDataRef.current.pixels.splice(rowIdx, 1);
    !config?.noSessionAdd &&
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

  const deleteCol = (colIdx: number, config?: { noSessionAdd?: boolean }) => {
    const deletedCol: PixelGridCanvasCell[] = [];
    for (const row of savedCanvasDataRef.current.pixels) {
      deletedCol.push(row.splice(colIdx, 1)[0]);
    }
    !config?.noSessionAdd &&
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

  const addRow = (
    rowIdx: number,
    pos: "top" | "bottom",
    config?: { noSessionAdd?: boolean; row?: PixelGridCanvasCell[] }
  ) => {
    const insertIndex = pos === "top" ? rowIdx : rowIdx + 1;
    savedCanvasDataRef.current.pixels.splice(
      insertIndex,
      0,
      config?.row ||
        new Array(savedCanvasDataRef.current.pixels[0].length).fill({
          hex: DEFAULT_CELL_COLOR,
        })
    );
    !config?.noSessionAdd &&
      saveSession({
        mode: "gridSizeChange",
        data: {
          action: "add",
          gridLayer: "row",
          idx: insertIndex,
        },
      });
  };

  const addCol = (
    colIdx: number,
    pos: "left" | "right",
    config?: { noSessionAdd?: boolean; col?: PixelGridCanvasCell[] }
  ) => {
    const insertIdx = pos === "left" ? colIdx : colIdx + 1;
    for (let i = 0; i < savedCanvasDataRef.current.pixels.length; i++) {
      savedCanvasDataRef.current.pixels[i].splice(
        insertIdx,
        0,
        config?.col?.[i] || {
          hex: DEFAULT_CELL_COLOR,
        }
      );
    }
    !config?.noSessionAdd &&
      saveSession({
        mode: "gridSizeChange",
        data: {
          action: "add",
          gridLayer: "col",
          idx: insertIdx,
        },
      });
  };

  const undo = (
    session: GridSizeChangeAddSession | GridSizeChangeDeleteSession
  ) => {
    switch (session.data.action) {
      case "add":
        switch (session.data.gridLayer) {
          case "row":
            deleteRow(session.data.idx, { noSessionAdd: true });
            break;
          case "col":
            deleteCol(session.data.idx, { noSessionAdd: true });
        }
        break;
      case "delete":
        switch (session.data.gridLayer) {
          case "row":
            addRow(session.data.idx, "top", {
              noSessionAdd: true,
              row: session.data.layer,
            });
            break;
          case "col":
            addCol(session.data.idx, "left", {
              noSessionAdd: true,
              col: session.data.layer,
            });
        }
    }
  };
  const redo = (
    session: GridSizeChangeAddSession | GridSizeChangeDeleteSession
  ) => {
    switch (session.data.action) {
      case "add":
        switch (session.data.gridLayer) {
          case "row":
            addRow(session.data.idx, "top", { noSessionAdd: true });
            break;
          case "col":
            addCol(session.data.idx, "left", { noSessionAdd: true });
        }
        break;
      case "delete":
        switch (session.data.gridLayer) {
          case "row":
            deleteRow(session.data.idx, {
              noSessionAdd: true,
            });
            break;
          case "col":
            deleteCol(session.data.idx, {
              noSessionAdd: true,
            });
        }
    }
  };
  return {
    addRow,
    addCol,
    deleteRow,
    deleteCol,
    undo,
    redo,
  };
}
