import { useState } from "react";
import { ColorCountTracker } from "./useColorCanvasTools";
import { knitting } from "@/constants/pixelGrid/stitches";

export type ActiveColorPalette = [string, number][];
export type ActiveStitchPalette = string[];
export type ActiveShapePalette = [string, string][];

export type EditMode = "colorChange" | "symbolChange" | "specialShapeChange";

type EditingConfigTools = {
  activeColorPalette: ActiveColorPalette;
  activeShapePalette: ActiveShapePalette;
  activeStitchPalette: ActiveStitchPalette;
  editMode: EditMode;
  setEditMode: React.Dispatch<React.SetStateAction<EditMode>>;
  swapColorInPalette: (colorIdx: number, hex: string) => void;
  swapStitchInPalette: (stitchIdx: number, stitch: string) => void;
  activeColorIdx: number;
  activeShapeIdx: number | null;
  activeStitchIdx: number;
  setActiveColorIdx: React.Dispatch<React.SetStateAction<number>>;
  setActiveStitchIdx: React.Dispatch<React.SetStateAction<number>>;
  setActiveShapeIdx: React.Dispatch<React.SetStateAction<number | null>>;
};

const NUM_ACTIVE_COLORS = 6;

export default function usePixelGridEditingConfigTools({
  colorCountTracker,
}: {
  colorCountTracker: ColorCountTracker;
}): EditingConfigTools {
  const [activeColorPalette, setActiveColorPalette] = useState(
    Object.entries(colorCountTracker)
      .sort((c1, c2) => c2[1] - c1[1])
      .slice(0, NUM_ACTIVE_COLORS)
  );

  const [activeStitchPalette, setActiveStitchPalette] =
    useState<ActiveStitchPalette>(["p", "k", "yo", "k2tog", "p2tog", "k1_tbl"]);
  const [activeShapePalette, setActiveShapePalette] =
    useState<ActiveShapePalette>([["line", "/specialShapes/line.svg"]]);

  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [activeStitchIdx, setActiveStitchIdx] = useState(0);

  const [activeShapeIdx, setActiveShapeIdx] = useState<number | null>(null);

  const [editMode, setEditMode] = useState<EditMode>("colorChange");

  const swapColorInPalette = (colorIdx: number, hex: string) => {
    setActiveColorPalette([
      ...activeColorPalette.slice(0, colorIdx),
      [hex, colorCountTracker[hex] || 0],
      ...activeColorPalette.slice(colorIdx + 1),
    ]);
  };

  const swapStitchInPalette = (stitchIdx: number, stitch: string) => {
    setActiveStitchPalette([
      ...activeStitchPalette.slice(0, stitchIdx),
      stitch,
      ...activeStitchPalette.slice(stitchIdx + 1),
    ]);
  };

  return {
    activeColorIdx,
    activeShapeIdx,
    activeStitchIdx,
    setActiveColorIdx,
    setActiveShapeIdx,
    setActiveStitchIdx,
    activeColorPalette,
    activeStitchPalette,
    activeShapePalette,
    editMode,
    setEditMode,
    swapColorInPalette,
    swapStitchInPalette,
  };
}
