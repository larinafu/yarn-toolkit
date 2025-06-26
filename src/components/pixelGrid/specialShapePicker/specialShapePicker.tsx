import Image from "next/image";
import { ActiveShapePalette } from "@/hooks/pixelGrid/usePixelGridEditingConfigTools";
import SimpleColorPicker from "../simpleColorPicker/simpleColorPicker";
import React from "react";

export default function SpecialShapePicker({
  activeShapePalette,
  activeShapeIdx,
  setActiveShapeIdx,
  shapeColor,
  setShapeColor,
}: {
  activeShapePalette: ActiveShapePalette;
  activeShapeIdx: number | "erase" | null;
  setActiveShapeIdx: React.Dispatch<
    React.SetStateAction<number | "erase" | null>
  >;
  shapeColor: string;
  setShapeColor: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex items-center">
      {activeShapePalette.map(([shapeKey, img], idx) => (
        <button
          key={idx}
          className={`buttonBlank p-2 m-2 rounded-sm size-10 ${
            activeShapeIdx === idx
              ? "border-amaranth hover:border-amaranth active:border-amaranth"
              : "border-gray-100 hover:border-gray-100 active:border-gray-100"
          }`}
          onClick={() => setActiveShapeIdx(idx)}
        >
          <Image src={img} alt={shapeKey} width={25} height={25} />
        </button>
      ))}
      <button
        className={`buttonBlank p-2 m-2 rounded-sm size-10 ${
          activeShapeIdx === "erase"
            ? "bg-amaranth-light active:border-amaranth"
            : "border-gray-100 active:border-gray-100"
        }`}
        onClick={() => setActiveShapeIdx("erase")}
      >
        <Image src={"/eraser.svg"} alt="erase" width={25} height={25} />
      </button>
      <SimpleColorPicker hex={shapeColor} setHex={setShapeColor} />
    </div>
  );
}
