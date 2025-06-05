export const getPatternSizeWidthLimited = (
  limit: number,
  widthHeightRatio: number,
  imgWidth: number,
  imgHeight: number
) => {
  const pixelsPerCol = imgWidth / limit;
  const pixelsPerRow = pixelsPerCol * widthHeightRatio;
  const numRows = Math.ceil(imgHeight / pixelsPerRow);
  return {
    numCols: limit,
    numRows,
  };
};

export const getPatternSizeHeightLimited = (
  limit: number,
  widthHeightRatio: number,
  imgWidth: number,
  imgHeight: number
) => {
  const pixelsPerRow = imgHeight / limit;
  const pixelsPerCol = pixelsPerRow / widthHeightRatio;
  const numCols = Math.ceil(imgWidth / pixelsPerCol);
  return {
    numCols,
    numRows: limit,
  };
};

export const getInitialPatternSize = (
  limit: number,
  widthHeightRatio: number,
  imgWidth: number,
  imgHeight: number
) => {
  // width limited
  const patternSizeWidthLimited = getPatternSizeWidthLimited(
    limit,
    widthHeightRatio,
    imgWidth,
    imgHeight
  );
  if (patternSizeWidthLimited.numRows <= limit) {
    return patternSizeWidthLimited;
  }
  // height limited
  return getPatternSizeHeightLimited(
    limit,
    widthHeightRatio,
    imgWidth,
    imgHeight
  );
};
