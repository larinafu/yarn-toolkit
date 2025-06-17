import Image from "next/image";
import { ActiveShapePalette } from "@/hooks/pixelGrid/usePixelGridEditingConfigTools";

export default function SpecialShapePicker({
  activeShapePalette,
  activeShapeIdx,
  setActiveShapeIdx,
}: {
  activeShapePalette: ActiveShapePalette;
  activeShapeIdx: number | null;
  setActiveShapeIdx: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  return (
    <div>
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
    </div>
  );
}
