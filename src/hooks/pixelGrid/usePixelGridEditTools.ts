import { PixelGridCanvasSavedData } from "@/types/pixelGrid";
import { ColorCanvasTools } from "./useColorCanvasTools";
import { EditMode } from "./usePixelGridEditingConfigTools";
import { PixelGridInteractionLayerTools } from "./usePixelGridInteractionLayerTools";
import { StitchCanvasTools } from "./usePixelGridStitchCanvasTools";
import { EditRecordTools } from "./usePixelGridEditRecordTools";
import { PixelGridSpecialShapesCanvasTools } from "./usePixelGridSpecialShapesCanvasTools";

export type PixelGridEditTools = {
  handleCanvasEdit: (
    e: any,
    pointerTrigger: "move" | "down",
    data?: any
  ) => void;
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
  editRecordTools,
  activeShapeIdx,
  stitchColor,
  shapeColor,
}: {
  colorCanvasTools: ColorCanvasTools;
  stitchCanvasTools: StitchCanvasTools;
  specialShapesTools: PixelGridSpecialShapesCanvasTools;
  editMode: EditMode;
  activeColor: string;
  activeStitch: string;
  interactionLayerTools: PixelGridInteractionLayerTools;
  editRecordTools: EditRecordTools;
  activeShapeIdx: number | "erase" | null;
  stitchColor: string;
  shapeColor: string;
}): PixelGridEditTools {
  const handleCanvasEdit = (
    e: PointerEvent,
    pointerTrigger: "move" | "down",
    data?: any
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
            color: stitchColor,
          });
          editRecordTools.addToSession(row, col, {
            stitch: activeStitch,
            stitchColor,
          });
        }
        break;
      case "specialShapeChange":
        if (activeShapeIdx !== "erase") {
          switch (pointerTrigger) {
            case "down":
              specialShapesTools.addShape(row, col, shapeColor, "line");
              editRecordTools.addToSession(row, col, {
                shapeId: specialShapesTools.specialShapesRef.current.length - 1,
                pointId: 1,
                type: activeShapeIdx === null ? "update" : "create",
                newLoc: { row, col },
              });
              break;
            case "move":
              specialShapesTools.moveTarPoint({ row, col });
              if (
                specialShapesTools.tarPoint &&
                !(
                  specialShapesTools.tarPoint.curLoc &&
                  specialShapesTools.tarPoint.curLoc.row === row &&
                  specialShapesTools.tarPoint.curLoc.col === col
                )
              ) {
                editRecordTools.addToSession(row, col, {
                  shapeId: specialShapesTools.tarPoint.shapeId,
                  pointId: specialShapesTools.tarPoint.pointId,
                  type: activeShapeIdx === null ? "update" : "create",
                  newLoc: { row, col },
                });
              }
          }
        } else {
          const shape =
            specialShapesTools.specialShapesRef.current[data.shapeId];
          specialShapesTools.removeShape(data.shapeId);
          editRecordTools.addToSession(row, col, {
            type: "erase",
            shapeId: data.shapeId,
            shape,
          });
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
