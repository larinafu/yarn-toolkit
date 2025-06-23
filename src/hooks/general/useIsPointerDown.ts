import { useEffect, useState } from "react";

export const useIsPointerDown = (config?: {
  handlePointerUp?: (e: any) => void;
  dependencies?: any[];
}) => {
  const [isPointerDown, setPointerDown] = useState(false);
  useEffect(() => {
    document.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button === 0) {
        setPointerDown(true);
      }
    });
    document.addEventListener("pointerup", (e) => {
      setPointerDown(false);
      config?.handlePointerUp?.(e);
    });
  }, config?.dependencies || []);

  return isPointerDown;
};
