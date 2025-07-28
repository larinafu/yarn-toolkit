export const getStitchWidthUnitsFromId = (stitch: string | null) =>
  isCable(stitch)
    ? (stitch as string).match(/\d+/g)?.reduce((a, b) => a + Number(b), 0) ?? 0
    : 1;

export const isCable = (stitch: string | null): boolean =>
  typeof stitch === "string" && stitch.includes("cable");
