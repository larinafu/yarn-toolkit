import { defaultColorsConstants } from "@/constants/colors";

export const getColor = (hex: string) => {
  let colorObj = undefined;
  for (const colorRow of defaultColorsConstants) {
    colorObj = Object.values(colorRow).find((colorObj) => colorObj.hex === hex);
    if (colorObj) {
      return colorObj;
    }
  }
  return colorObj;
};
