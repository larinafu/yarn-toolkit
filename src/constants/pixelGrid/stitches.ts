import { StitchGroup } from "@/types/pixelGrid";

export const knitting: StitchGroup = {
  k: {
    info: {
      rs: { abbr: "k", name: "Knit" },
      ws: { abbr: "p", name: "Purl" },
    },
    svgPaths: ["", "stroke"],
    svg: "/stitches/knitting/k.svg",
  },
  p: {
    info: {
      rs: { abbr: "p", name: "Purl" },
      ws: { abbr: "k", name: "Knit" },
    },
    svgPaths: ["M 40 50 A 1 1 0 0 0 60 50 A 1 1 0 0 0 40 50", "fill"],
    svg: "/stitches/knitting/p.svg",
  },
  yo: {
    info: { abbr: "yo", name: "Yarn over" },
    svgPaths: ["M 90 53 A 1 1 0 0 0 10 50 A 1 1 0 0 0 90 53", "stroke"],
    svg: "/stitches/knitting/yo.svg",
  },
  k2tog: {
    info: {
      rs: { abbr: "k2tog", name: "Knit two stitches together" },
      ws: { abbr: "p2tog", name: "Purl two stitches together" },
    },
    svgPaths: ["M 7 93 L 93 7", "stroke"],
    svg: "/stitches/knitting/k2tog.svg",
  },
  p2tog: {
    info: {
      rs: { abbr: "p2tog", name: "Purl two stitches together" },
      ws: { abbr: "k2tog", name: "Knit two stitches together" },
    },
    svgPaths: [
      ["M 28 35 A 1 1 0 0 0 28 16 A 1 1 0 0 0 28 35", "fill"],
      ["M 7 93 L 93 7", "stroke"],
    ],
    svg: "/stitches/knitting/p2tog.svg",
  },
  ssk: {
    info: {
      rs: { abbr: "ssk", name: "Slip slip knit" },
      ws: { abbr: "ssp", name: "Slip slip purl" },
    },
    svgPaths: ["M 15 15 L 85 85", "stroke"],
    svg: "/stitches/knitting/ssk.svg",
  },
  ssp: {
    info: {
      rs: { abbr: "ssp", name: "Slip slip purl" },
      ws: { abbr: "ssk", name: "Slip slip knit" },
    },
    svgPaths: [
      ["M 65 28 A 1 1 90 0 0 84 28 A 1 1 90 0 0 65 28", "fill"],
      ["M 7 7 L 93 93", "stroke"],
    ],
    svg: "/stitches/knitting/ssp.svg",
  },
  k1fb: {
    info: {
      rs: { abbr: "k1fb", name: "Knit one front and back" },
      ws: { abbr: "p1fb", name: "Purl one front and back" },
    },
    svgPaths: [
      "M 15 40 L 50 80 L 85 40 M 61 30 A 1 1 0 0 0 37 30 M 61 30 C 60 43 44.6667 44 39 55 L 61 55",
      "stroke",
    ],
    svg: "/stitches/knitting/k1fb.svg",
  },
  m1: {
    info: {
      rs: { abbr: "m1k", name: "Make one knitwise" },
      ws: { abbr: "m1p", name: "Make one purlwise" },
    },
    svgPaths: ["M 10 90 L 10 10 L 50 50 L 90 10 L 90 90", "stroke"],
    svg: "/stitches/knitting/m1.svg",
  },
  m1p: {
    info: {
      rs: { abbr: "m1p", name: "Make one purlwise" },
      ws: { abbr: "m1k", name: "Make one knitwise" },
    },
    svgPaths: [
      "M 10 90 L 10 10 L 30 40 L 50 10 L 50 90 M 60 90 L 60 10 C 102 10 102 50 60 50",
      "stroke",
    ],
    svg: "/stitches/knitting/m1p.svg",
  },
  m1r: {
    info: { abbr: "m1r", name: "Right-slanting make one" },
    svgPaths: [
      "M 10 90 L 10 10 L 30 40 L 50 10 L 50 90 M 60 90 L 60 10 C 100 10 100 50 60 50 Q 82 49 90 90",
      "stroke",
    ],
    svg: "/stitches/knitting/m1r.svg",
  },
  m1l: {
    info: { abbr: "m1l", name: "Left-slanting make one" },
    svgPaths: [
      "M 10 90 L 10 10 L 30 40 L 50 10 L 50 90 M 60 10 L 60 90 L 90 90",
      "stroke",
    ],
    svg: "/stitches/knitting/m1l.svg",
  },
  rli: {
    info: { abbr: "rli", name: "Right-slanting lifted increase" },
    svgPaths: ["M 25 25 L 25 75 L 75 25", "stroke"],
    svg: "/stitches/knitting/rli.svg",
  },
  lli: {
    info: { abbr: "lli", name: "Left-slanting lifted increase" },
    svgPaths: ["M 25 25 L 75 75 L 75 25", "stroke"],
    svg: "/stitches/knitting/lli.svg",
  },
  sl_wyib: {
    info: {
      rs: {
        abbr: "sl 1 wyib",
        name: "Slip stitch 1 purlwise with yarn in back",
      },
      ws: {
        abbr: "sl 1 wyif",
        name: "Slip stitch 1 purlwise with yarn in front",
      },
    },
    svgPaths: ["M 25 25 L 50 75 L 75 25", "stroke"],
    svg: "/stitches/knitting/sl_wyib.svg",
  },
  sl_wyif: {
    info: {
      rs: {
        abbr: "sl 1 wyif",
        name: "Slip stitch 1 purlwise with yarn in front",
      },
      ws: {
        abbr: "sl 1 wyib",
        name: "Slip stitch 1 purlwise with yarn in back",
      },
    },
    svgPaths: ["M 25 25 L 50 75 L 75 25 M 25 50 L 75 50", "stroke"],
    svg: "/stitches/knitting/sl_wyif.svg",
  },
  k3tog: {
    info: {
      rs: {
        abbr: "k3tog",
        name: "Knit 3 together",
      },
      ws: {
        abbr: "p3tog",
        name: "Purl 3 together",
      },
    },
    svgPaths: ["M 90 10 L 10 90 M 50 90 L 50 50 L 90 90", "stroke"],
    svg: "/stitches/knitting/k3tog.svg",
  },
  p3tog: {
    info: {
      rs: {
        abbr: "p3tog",
        name: "Purl 3 together",
      },
      ws: {
        abbr: "k3tog",
        name: "Knit 3 together",
      },
    },
    svgPaths: [
      ["M 40 40 A 1 1 0 0 0 46 46 A 1 1 0 0 0 40 40", "fill"],
      ["M 90 10 L 10 90 M 50 90 L 50 50 L 90 90", "stroke"],
    ],
    svg: "/stitches/knitting/p3tog.svg",
  },
  sssk: {
    info: {
      rs: {
        abbr: "sssk",
        name: "Slip slip slip knit",
      },
      ws: {
        abbr: "sssp",
        name: "Slip slip slip purl",
      },
    },
    svgPaths: ["M 10 10 L 90 90 M 50 90 L 50 50 L 10 90 ", "stroke"],
    svg: "/stitches/knitting/sssk.svg",
  },
  sssp: {
    info: {
      rs: {
        abbr: "sssp",
        name: "Slip slip slip purl",
      },
      ws: {
        abbr: "sssk",
        name: "Slip slip slip knit",
      },
    },
    svgPaths: [
      ["M 60 40 A 1 1 90 0 1 54 46 A 1 1 90 0 1 60 40", "fill"],
      ["M 10 10 L 90 90 M 50 90 L 50 50 L 10 90", "stroke"],
    ],
    svg: "/stitches/knitting/sssp.svg",
  },
  s2kp2: {
    info: {
      rs: {
        abbr: "s2kp2",
        name: "Slip 2 knit 1 pass 2 slip stitches over",
      },
      ws: {
        abbr: "sspp2",
        name: "Slip 2 purl 1 pas 2 slip stitches over",
      },
    },
    svgPaths: ["M 15 75 L 50 25 L 50 75 M 50 25 L 85 75", "stroke"],
    svg: "/stitches/knitting/s2kp2.svg",
  },
  k1_tbl: {
    info: {
      rs: {
        abbr: "k1 tbl",
        name: "Knit 1 through the back",
      },
      ws: {
        abbr: "p1 tbl",
        name: "Purl 1 through the back",
      },
    },
    svgPaths: [
      "M 25 85 Q 75 66 75 30 A 1 1 0 0 0 25 30 Q 25 66 75 85",
      "stroke",
    ],
    svg: "/stitches/knitting/k1-tbl.svg",
  },
  p1_tbl: {
    info: {
      rs: {
        abbr: "p1 tbl",
        name: "Purl 1 through the back",
      },
      ws: {
        abbr: "k1 tbl",
        name: "Knit 1 through the back",
      },
    },
    svgPaths: [
      ["M 25 85 Q 75 66 75 30 A 1 1 0 0 0 25 30 Q 25 66 75 85", "stroke"],
      ["M 50 15 A 1 1 0 0 0 50 35 A 1 1 0 0 0 50 15", "fill"],
    ],
    svg: "/stitches/knitting/p1_tbl.svg",
  },
  bobble: {
    info: {
      abbr: "bobble",
      name: "Bobble",
    },
    svgPaths: [
      "M 30 15 L 30 85 L 60 85 A 1 1 0 0 0 60 45 L 30 45 M 57 45 A 1 1 0 0 0 57 15 L 30 15",
      "stroke",
    ],
    svg: "/stitches/knitting/bobble.svg",
  },
  inc_1t3: {
    info: {
      abbr: "inc 1-to-3",
      name: "Increase 1 to 3",
    },
    svgPaths: ["M 15 25 L 50 75 L 50 25 M 50 75 L 85 25", "stroke"],
    svg: "/stitches/knitting/inc_1t3.svg",
  },
  inc_1t4: {
    info: {
      abbr: "inc 1-to-4",
      name: "Increase 1 to 4",
    },
    svgPaths: [
      "M 15 35 L 50 85 M 50 85 L 85 35 M 65 45 L 35 45 L 55 20 L 55 60",
      "stroke",
    ],
    svg: "/stitches/knitting/inc_1t4.svg",
  },
  inc_1t5: {
    info: {
      abbr: "inc 1-to-5",
      name: "Increase 1 to 5",
    },
    svgPaths: [
      "M 15 35 L 50 85 M 50 85 L 85 35 M 58 15 L 40 15 L 40 30 L 50 30 A 1 1 0 0 1 50 55 L 40 55",
      "stroke",
    ],
    svg: "/stitches/knitting/inc_1t5.svg",
  },
  dec_4t1_r: {
    info: {
      abbr: "dec 4-to-1 r",
      name: "Decrease 4 to 1 (right slanting)",
    },
    svgPaths: [
      "M 20 40 L 75 15 L 80 40 M 65 60 L 35 60 L 55 35 L 55 75",
      "stroke",
    ],
    svg: "/stitches/knitting/dec_4t1_r.svg",
  },
  dec_4t1_l: {
    info: {
      abbr: "dec 4-to-1 l",
      name: "Decrease 4 to 1 (left slanting)",
    },
    svgPaths: [
      "M 20 40 L 25 15 L 80 40 M 60 60 L 30 60 L 50 35 L 50 75",
      "stroke",
    ],
    svg: "/stitches/knitting/dec_4t1_l.svg",
  },
  dec_4t1: {
    info: {
      abbr: "dec 4-to-1",
      name: "Decrease 4 to 1 (centered)",
    },
    svgPaths: [
      "M 20 40 L 50 15 L 80 40 M 62 60 L 32 60 L 52 35 L 52 75",
      "stroke",
    ],
    svg: "/stitches/knitting/dec_4t1.svg",
  },
  dec_5t1: {
    info: {
      abbr: "dec 5-to-1",
      name: "Decrease 5 to 1 (centered)",
    },
    svgPaths: [
      "M 20 40 L 50 15 L 80 40 M 58 35 L 40 35 L 40 50 L 50 50 A 1 1 0 0 1 50 75 L 40 75",
      "stroke",
    ],
    svg: "/stitches/knitting/dec_5t1.svg",
  },
  k1_twice: {
    info: {
      abbr: "k1 wrapping yarn twice around needle",
      name: "Knit 1 wrapping yarn twice around needle",
    },
    svgPaths: [
      "M 50 20 A 1 1 0 0 0 50 80 A 1 1 0 0 0 50 20 M 40 40 A 1 1 0 0 1 60 40 C 59 52 39 53 40 65 L 60 65",
      "stroke",
    ],
    svg: "/stitches/knitting/k1_twice.svg",
  },
  bo: {
    info: {
      abbr: "bo",
      name: "Bind off",
    },
    svgPaths: ["M 10 70 A 1 1 0 0 1 90 70", "stroke"],
    svg: "/stitches/knitting/bo.svg",
  },
  st_rem: {
    info: {
      abbr: "St rem on right needle after last BO st",
      name: "Stitch remains on right needle after last bind off stitch",
    },
    svgPaths: ["M 50 95 A 1 1 0 0 1 150 95", "stroke"],
    svg: "/stitches/knitting/st_rem.svg",
  },
  co: {
    info: {
      abbr: "co",
      name: "Cast on",
    },
    svgPaths: ["M 50 20 L 50 80 M 20 50 L 80 50", "stroke"],
    svg: "/stitches/knitting/co.svg",
  },
};
