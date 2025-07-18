export type BaseOption = "image" | "blank";

export type Swatch = {
  width: number;
  height: number;
};

export type SwatchInputs = {
  width: string;
  height: string;
};
export type PatternSizeInputs = {
  numRows: string | number;
  numCols: string | number;
};
export type PatternSizeDisplay = {
  numRows: string | number;
  numCols: string | number;
};
export type PatternSize = {
  numRows: number;
  numCols: number;
};

export type ImageInfo = {
  src: string;
  fileName: string;
  imageData: ImageData;
};

export type AspectRatio = {
  width: number;
  height: number;
};

export type CanvasPixelData = { hex: string; isSelected?: boolean }[][];

export type CreateData = {
  pixels: CanvasPixelData;
  curImg: string;
  swatch: Swatch;
  previewImg: string;
};

export type PixelGridCanvasCell = {
  hex: string;
  stitch?: string;
  stitchColor?: string;
};

export type PixelGridCanvasCellDimensions = {
  width: number;
  height: number;
};

export type PixelGridCellWidthHeightRatio = number;

export type PixelGridCanvasDimensions = PixelGridCanvasCellDimensions;

export type PixelGridNumberFormat =
  | "numbersBetween"
  | "numbersBetweenAlternating"
  | "numbersBetweenRight"
  | "numbersBetweenRightOdd";

export type PixelGridNumberFormatGuide = {
  numbersReversed: boolean;
  stepCount: number;
  top: {
    visible: "even" | "odd" | "all" | "none";
  };
  bottom: {
    visible: "even" | "odd" | "all" | "none";
  };
  left: { visible: "even" | "odd" | "all" | "none" };
  right: { visible: "even" | "odd" | "all" | "none" };
};

export type PixelGridNumberFormatGuides = {
  [key in PixelGridNumberFormat]: PixelGridNumberFormatGuide;
};

export type PixelGridCanvasSavedData = {
  pixels: PixelGridCanvasCell[][];
  swatch: Swatch;
  previewImg: string;
  numberFormat: PixelGridNumberFormat;
};

export type PixelGridCanvasWindow = {
  startRow: number;
  startCol: number;
  visibleRows: number;
  visibleCols: number;
};

export type PixelGridCanvasNumRowsAndCols = {
  numRows: number;
  numCols: number;
};

// stitch types
export type SvgPath = [string, "stroke" | "fill"];

export type SvgPaths = SvgPath[] | SvgPath;

export const isSvgPath = (path: SvgPath | SvgPaths): path is SvgPath =>
  typeof path[0] === "string";

export type StitchInfo = {
  abbr: string;
  name: string;
};

export type StitchGroup = {
  [stitchId: string]: {
    info:
      | { rs: StitchInfo[] | StitchInfo; ws: StitchInfo[] | StitchInfo }
      | StitchInfo
      | StitchInfo[];
    svgPaths: SvgPaths;
    svg: string;
  };
};
