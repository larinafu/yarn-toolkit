import Dropdown from "../dropdown/dropdown";
import Image from "next/image";

export default function ResponsiveList({
  items,
}: {
  items: React.ReactNode[];
}) {
  return (
    <div className="relative w-full">
      <div className="max-w-6xl mx-auto px-4 flex justify-end items-center h-14">
        {/* Toggle Button for Small Screens */}
        <div className="size-fit sm:hidden">
          <Dropdown
            btnContent={
              <Image
                src={"/more-options.svg"}
                width={30}
                height={30}
                className="block"
                alt="More configurations and options for knitting chart"
              />
            }
          >
            <ul className="card p-0 shrink-0 fadeInFast right-4 top-full mt-2 z-50 bg-white rounded-md flex flex-col">
              {items.map((item, idx) => (
                <li key={idx} className="hover:bg-gray-300 w-full">
                  {item}
                </li>
              ))}
            </ul>
          </Dropdown>
        </div>

        {/* Horizontal List (Large Screens) */}
        <ul className="hidden sm:flex items-center space-x-6">
          {items.map((item, idx) => {
            return <li key={idx}>{item}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}
