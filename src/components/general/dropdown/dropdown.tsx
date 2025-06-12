import React, { useState } from "react";

import { useRefWithClickawayListener } from "@/hooks/general/useRefWithClickawayListener";
import useEffectWithContainerDimensions from "@/hooks/general/useEffectWithContainerDims";

type DropdownProps = {
  btnContent: React.ReactNode;
  children: React.ReactNode;
};

export default function Dropdown({ btnContent, children }: DropdownProps) {
  const [isOpen, setOpen] = useState(false);
  const ref = useRefWithClickawayListener(() => {
    setOpen(false);
  }, []);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: "auto" | number;
    bottom: "auto" | number;
    left: "auto" | number;
    right: "auto" | number;
  }>({
    top: "auto",
    bottom: "auto",
    left: "auto",
    right: "auto",
  });

  const dropdown = useEffectWithContainerDimensions(
    (rect) => {
      if (isOpen && rect) {
        if (rect.right > innerWidth - 10) {
          setDropdownPosition({
            ...dropdownPosition,
            right: 10,
          });
        }
      }
    },
    [isOpen]
  );

  return (
    <div ref={ref}>
      <button onClick={() => setOpen(!isOpen)} className="buttonBlank">
        {btnContent}
      </button>
      {isOpen && (
        <section
          ref={dropdown.ref}
          className={`fadeInFast absolute z-10`}
          style={{
            ...dropdownPosition,
          }}
        >
          {children}
        </section>
      )}
    </div>
  );
}
