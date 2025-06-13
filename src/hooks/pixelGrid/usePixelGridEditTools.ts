import { PixelGridCanvasSavedData } from "@/types/pixelGrid";
import { ColorCanvasTools } from "./useColorCanvasTools";
import { EditMode } from "./usePixelGridEditingConfigTools";
import { PixelGridInteractionLayerTools } from "./usePixelGridInteractionLayerTools";
import { StitchCanvasTools } from "./usePixelGridStitchCanvasTools";
import { EditRecordTools } from "./usePixelGridEditRecordTools";
import { PixelGridSpecialShapesCanvasTools } from "./usePixelGridSpecialShapesCanvasTools";

export type PixelGridEditTools = {
  handleCanvasEdit: (e: any, pointerTrigger: "move" | "down") => void;
  handleCompleteCanvasEdit: () => void;
};

export default function usePixelGridEditTools({
  colorCanvasTools,
  stitchCanvasTools,
  specialShapesTools,
  editMode,
  activeColor,
  activeStitch,
  interactionLayerTools,
  savedCanvasDataRef,
  editRecordTools,
  activeShapeIdx,
}: {
  colorCanvasTools: ColorCanvasTools;
  stitchCanvasTools: StitchCanvasTools;
  specialShapesTools: PixelGridSpecialShapesCanvasTools;
  editMode: EditMode;
  activeColor: string;
  activeStitch: string;
  interactionLayerTools: PixelGridInteractionLayerTools;
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  editRecordTools: EditRecordTools;
  activeShapeIdx: number | null;
}): PixelGridEditTools {
  const handleCanvasEdit = (
    e: PointerEvent,
    pointerTrigger: "move" | "down"
  ) => {
    const { row, col } = interactionLayerTools.getPixelPosFromPointerCoords(
      e,
      editMode
    );
    switch (editMode) {
      case "colorChange":
        if (
          !editRecordTools.sessionRef.current ||
          (editRecordTools.sessionRef.current.mode === "colorChange" &&
            !editRecordTools.sessionRef.current.data[row]?.[col])
        ) {
          colorCanvasTools.updatePixelColor({
            row,
            col,
            hex: activeColor,
          });
          editRecordTools.addToSession(row, col, activeColor);
        }
        break;
      case "symbolChange":
        if (
          !editRecordTools.sessionRef.current ||
          (editRecordTools.sessionRef.current.mode === "symbolChange" &&
            !editRecordTools.sessionRef.current.data[row]?.[col])
        ) {
          stitchCanvasTools.updateStitch({
            row,
            col,
            stitch: activeStitch,
            color: "#000",
          });
          editRecordTools.addToSession(row, col, activeStitch);
        }
        break;
      case "specialShapeChange":
        switch (pointerTrigger) {
          case "down":
            specialShapesTools.addShape(row, col, "line");
            break;
          case "move":
            if (
              specialShapesTools.tarPoint &&
              !(
                specialShapesTools.tarPoint.curLoc.row === row &&
                specialShapesTools.tarPoint.curLoc.col === col
              )
            ) {
              specialShapesTools.moveTarPoint({ row, col });
              editRecordTools.addToSession(row, col, {
                shapeId: specialShapesTools.tarPoint.shapeId,
                pointId: specialShapesTools.tarPoint.pointId,
                type: activeShapeIdx === null ? "update" : "create",
                newLoc: { row, col },
              });
            }
        }
    }
  };

  const handleCompleteCanvasEdit = () => {
    editRecordTools.saveSession();
  };
  return {
    handleCanvasEdit,
    handleCompleteCanvasEdit,
  };
}
