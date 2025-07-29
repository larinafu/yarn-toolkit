import { useState } from "react";
import Dropdown from "../dropdown/dropdown";
import Image from "next/image";

export default function ResponsiveList({
  items,
}: {
  items: React.ReactNode[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <div className="max-w-6xl mx-auto px-4 flex justify-end items-center h-14">
        {/* Toggle Button for Small Screens */}
        <div className="sm:hidden">
          <Dropdown
            btnContent={
              <Image
                src={"/more-options.svg"}
                width={30}
                height={30}
                alt="More configurations and options for knitting chart"
              />
            }
          >
            <ul className="card fadeInFast absolute right-4 top-full mt-2 z-50 bg-white rounded-md p-2 flex flex-col space-y-2">
              {items.map((item, idx) => (
                <li key={idx} className="py-1 border-b last:border-b-0">
                  {item}
                </li>
              ))}
            </ul>
          </Dropdown>
        </div>
        {/* <button
          className="sm:hidden p-2 focus:outline-none"
          onClick={() => setOpen((prev) => !prev)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button> */}

        {/* Horizontal List (Large Screens) */}
        <ul className="hidden sm:flex space-x-6">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Dropdown (Small Screens) */}
      {/* {open && (
        <ul className="card fadeInFast absolute right-4 top-full mt-2 z-50 bg-white rounded-md p-2 flex flex-col space-y-2 sm:hidden">
          {items.map((item, idx) => (
            <li key={idx} className="py-1 border-b last:border-b-0">
              {item}
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
}
