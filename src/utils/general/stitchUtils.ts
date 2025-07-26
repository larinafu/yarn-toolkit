export const getCableStitchWidthUnits = (stitch: string) =>
  stitch.match(/\d+/g)?.reduce((a, b) => a + Number(b), 0) ?? 0;

export const isCable = (stitch: string) => stitch.includes("cable");
