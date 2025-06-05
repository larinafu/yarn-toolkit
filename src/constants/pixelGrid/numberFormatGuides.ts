import { PixelGridNumberFormatGuides } from "@/types/pixelGrid";

const numberFormatGuides: PixelGridNumberFormatGuides = {
  numbersBetween: {
    numbersReversed: true,
    stepCount: 1,
    left: {
      visible: "all",
    },
    right: {
      visible: "all",
    },
    top: {
      visible: "all",
    },
    bottom: {
      visible: "all",
    },
  },
  numbersBetweenRight: {
    numbersReversed: true,
    stepCount: 1,
    left: {
      visible: "none",
    },
    right: {
      visible: "all",
    },
    top: {
      visible: "all",
    },
    bottom: {
      visible: "all",
    },
  },
  numbersBetweenRightOdd: {
    numbersReversed: true,
    stepCount: 2,
    left: {
      visible: "none",
    },
    right: {
      visible: "odd",
    },
    top: {
      visible: "all",
    },
    bottom: {
      visible: "all",
    },
  },
  numbersBetweenAlternating: {
    numbersReversed: true,
    stepCount: 1,
    left: {
      visible: "even",
    },
    right: {
      visible: "odd",
    },
    top: {
      visible: "all",
    },
    bottom: {
      visible: "all",
    },
  },
};

export { numberFormatGuides };
