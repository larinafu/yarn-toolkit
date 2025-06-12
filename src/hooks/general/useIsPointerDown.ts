import { useEffect, useState } from "react";

export const useIsPointerDown = () => {
  const [isPointerDown, setPointerDown] = useState(false);
  useEffect(() => {
    document.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button === 0) {
        setPointerDown(true);
      }
    });
    document.addEventListener("pointerup", () => setPointerDown(false));
  }, []);

  return isPointerDown;
};
