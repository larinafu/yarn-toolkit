import { useRef, useState } from "react";

export default function useThrottler(fn: (...vars: any) => void) {
  const throttleContent = useRef<any>(null);
  const [isLoading, setLoading] = useState(false);
  return {
    isLoading,
    throttle: (...vars: any) => {
      setLoading(true);
      clearTimeout(throttleContent.current as string);
      const timer = setTimeout(() => {
        fn(...vars);
        setLoading(false);
      }, 1000);
      throttleContent.current = timer;
    },
  };
}
