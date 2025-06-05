import { useEffect } from "react";

export default function useScrollIntoView(
  scrollToRef: React.RefObject<any>,
  dependencies: any[]
) {
  useEffect(() => {
    scrollToRef.current?.scrollIntoView({ behavior: "smooth" });
  }, dependencies);
}
