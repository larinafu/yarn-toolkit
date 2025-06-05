import React, { useEffect, useRef } from "react";

export default function useEffectWithContainerDimensions(
  callback?: (rect?: DOMRect) => void,
  dependencies?: any[]
): {
  ref: React.RefObject<any>;
  getDims: () => DOMRect | undefined;
} {
  const ref = useRef<HTMLElement>(null);
//   const dims: DOMRect | undefined = ref.current?.getBoundingClientRect();
  useEffect(() => {
    const dims = ref.current?.getBoundingClientRect();
    callback?.(dims);
  }, dependencies || []);
  return {
    ref,
    getDims: () => ref.current?.getBoundingClientRect(),
  };
}
