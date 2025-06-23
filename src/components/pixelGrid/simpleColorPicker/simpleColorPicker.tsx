import Dropdown from "@/components/general/dropdown/dropdown";
import { simpleColorConstants } from "@/constants/colors";
import Image from "next/image";
import { useState } from "react";

export default function SimpleColorPicker({
  hex,
  setHex,
}: {
  hex: string;
  setHex: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dropdown
      btnContent={
        <div className="flex border bg-white border-gray-400 p-2 rounded-2xl w-fit">
          <div
            style={{ backgroundColor: hex }}
            className="h-5 aspect-square rounded-full mr-1 shadowBig"
          ></div>
          <Image src="/down-arrow.svg" alt="expand" width={10} height={10} className="" />
        </div>
      }
      isOpenFromContainer={open}
      setOpenFromContainer={setOpen}
    >
      <ul className="card p-0">
        {simpleColorConstants.map((color) => (
          <li
            key={color}
            className={`rounded-xl ${
              color === hex ? "bg-amaranth-light" : ""
            }`}
          >
            <button
              className="p-3 buttonBlank"
              onClick={() => {
                setHex(color);
                setOpen(false);
              }}
            >
              <div
                className={`size-5 rounded-full shadowBig`}
                style={{ backgroundColor: color }}
              ></div>
            </button>
          </li>
        ))}
      </ul>
    </Dropdown>
  );
}
