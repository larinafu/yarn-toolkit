import { PatternSizeInputs, SwatchInputs } from "@/types/pixelGrid";

export const PROJ_SIZE_LIMIT = 75;

export const isInputAllZeros = (val: string) => {
  return /^[0*]+$/.test(val);
};

export const isInputANumber = (val: string) => {
  return /^\d+$/.test(val);
};

export const isValidSwatch = (swatch: SwatchInputs) => {
  if (swatch.width === "" || swatch.height === "") {
    return { isValid: false, error: "missing required fields" };
  }
  const widthHeightRatio = parseInt(swatch.width) / parseInt(swatch.height);
  if (widthHeightRatio < 1 / 3) {
    return { isValid: false, error: "cell ratio can not be less than 0.33" };
  } else if (widthHeightRatio > 3) {
    return { isValid: false, error: "cell ratio can not be greater than 3" };
  }
  return { isValid: true };
};

export const isValidProjectSize = (patternSize: PatternSizeInputs) => {
  let isValid = true;
  let error = null;
  if (typeof patternSize.numRows !== "number") {
    isValid = false;
    error = "Enter a row number";
  } else if (typeof patternSize.numCols !== "number") {
    isValid = false;
    error = "Enter a column number";
  } else if (
    patternSize.numRows > PROJ_SIZE_LIMIT ||
    patternSize.numCols > PROJ_SIZE_LIMIT
  ) {
    isValid = false;
    error = `Pattern cannot exceed ${PROJ_SIZE_LIMIT} rows or columns`;
  }
  return {
    isValid,
    error,
  };
};
