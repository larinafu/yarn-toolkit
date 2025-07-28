import { DEFAULT_CELL_COLOR, DEFAULT_COLORS } from "@/constants/colors";
import { PatternSize, PixelGridCanvasCell } from "@/types/pixelGrid";
import * as nearestColorMap from "nearest-color";

const getColorIndicesForCoord = (x: number, y: number, imgWidth: number) => {
  const red = y * (imgWidth * 4) + x * 4;
  return [red, red + 1, red + 2, red + 3];
};

export const generateNewPixelGridNoImage = (
  patternSize: PatternSize
): PixelGridCanvasCell[][] =>
  Array(patternSize.numRows)
    .fill(null)
    .map(() =>
      Array(patternSize.numCols).fill({
        hex: DEFAULT_CELL_COLOR,
        isPartOfCable: false,
        stitch: null,
        stitchColor: null,
      })
    );

export const generateNewPixelGrid = ({
  imgData,
  swatch,
  numStitches,
  numRows,
}: {
  imgData: ImageData;
  swatch: any;
  numStitches: number;
  numRows: number;
}): PixelGridCanvasCell[][] => {
  const colorMap = DEFAULT_COLORS.reduce(
    (map: { [colorName: string]: string }, colorRow) => {
      for (const [colorName, colorObj] of Object.entries(colorRow)) {
        map[colorName] = colorObj.hex;
      }
      return map;
    },
    {}
  );
  const nearestColor = nearestColorMap.from(colorMap);
  const widthHeightRatio = swatch.width / swatch.height;
  const pixelsPerStitch = imgData.width / numStitches;
  const pixelsPerRow = pixelsPerStitch * widthHeightRatio;
  const pixelGrid = [];
  for (let yInterval = 0; yInterval < numRows; yInterval += 1) {
    let pixelRow = [];
    const [yCoordStart, yCoordEnd] = [
      Math.floor(pixelsPerRow * yInterval),
      Math.ceil(pixelsPerRow * (yInterval + 1)),
    ];
    for (let xInterval = 0; xInterval < numStitches; xInterval += 1) {
      const [xCoordStart, xCoordEnd] = [
        Math.floor(pixelsPerStitch * xInterval),
        Math.ceil(pixelsPerStitch * (xInterval + 1)),
      ];
      const pixelInfo = {
        r: 0,
        g: 0,
        b: 0,
        a: 0,
        numPixels: 0,
      };
      for (let yStart = yCoordStart; yStart < yCoordEnd; yStart += 1) {
        for (let xStart = xCoordStart; xStart < xCoordEnd; xStart += 1) {
          const [r, g, b, a] = getColorIndicesForCoord(
            xStart,
            yStart,
            imgData.width
          );
          if (
            (imgData.data[r] || imgData.data[r] === 0) &&
            (imgData.data[g] || imgData.data[g] === 0) &&
            (imgData.data[b] || imgData.data[b] === 0) &&
            (imgData.data[a] || imgData.data[a] === 0)
          ) {
            pixelInfo.r += imgData.data[r];
            pixelInfo.g += imgData.data[g];
            pixelInfo.b += imgData.data[b];
            pixelInfo.a += imgData.data[a];
            pixelInfo.numPixels += 1;
          }
        }
      }
      const colorMatch = nearestColor({
        r: pixelInfo.r / pixelInfo.numPixels,
        g: pixelInfo.g / pixelInfo.numPixels,
        b: pixelInfo.b / pixelInfo.numPixels,
      });
      pixelRow.push({
        hex: colorMatch?.value || "#fff",
        isPartOfCable: false,
        stitch: null,
        stitchColor: null,
      });
    }
    pixelGrid.push(pixelRow);
  }
  return pixelGrid;
};
