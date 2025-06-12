import { useEffect, useRef } from "react";

export const useRefWithClickawayListener = (
  clickawayCallback: (e: any) => any,
  dependencies: any[]
) => {
  const ref = useRef<any>(null);
  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        clickawayCallback(e);
      }
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, dependencies);

  return ref;
};
