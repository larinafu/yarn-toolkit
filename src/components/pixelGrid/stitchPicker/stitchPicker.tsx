import Image from "next/image";
import { ActiveStitchPalette } from "@/hooks/pixelGrid/usePixelGridEditingConfigTools";

export default function StitchPicker({
  activeStitchPalette,
  activeStitchIdx,
  setActiveStitchIdx,
}: {
  activeStitchPalette: ActiveStitchPalette;
  activeStitchIdx: number;
  setActiveStitchIdx: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div>
      {activeStitchPalette.map((stitch, idx) => (
        <button
          key={idx}
          className={`buttonBlank pd-xxs mg-xxs rounded-sm ${
            activeStitchIdx === idx
              ? "border-amaranth hover:border-amaranth active:border-amaranth"
              : "border-gray-100 hover:border-gray-100 active:border-gray-100"
          }`}
          onClick={() => setActiveStitchIdx(idx)}
        >
          <Image src={stitch[1]} alt={stitch[0]} width={25} height={25} />
        </button>
      ))}
    </div>
  );
}
