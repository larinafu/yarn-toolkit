import { DEFAULT_COLORS } from "@/constants/colors";

export const getColor = (hex: string) => {
  let colorObj = undefined;
  for (const colorRow of DEFAULT_COLORS) {
    colorObj = Object.values(colorRow).find((colorObj) => colorObj.hex === hex);
    if (colorObj) {
      return colorObj;
    }
  }
  return colorObj;
};
