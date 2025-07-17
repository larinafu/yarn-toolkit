import Image from "next/image";
import { useRefWithClickawayListener } from "@/hooks/general/useRefWithClickawayListener";
import { useState } from "react";

const ValidationIndicator = ({
    errorMsg,
  }: {
    errorMsg: string | undefined | null;
  }) => {
    const [isOpen, setOpen] = useState(false);
    const ref = useRefWithClickawayListener(() => {
      setOpen(false);
    }, []);
    return (
      <div className="relative">
        <button
          className="buttonBlank"
          disabled={!errorMsg}
          onClick={() => setOpen(!isOpen)}
          ref={ref}
        >
          {errorMsg ? (
            <Image
              src={"/exclamation-triangle.svg"}
              alt="checkmark"
              width={20}
              height={20}
            />
          ) : (
            <Image
              src={"/checkmark-circle.svg"}
              alt="checkmark"
              width={20}
              height={20}
            />
          )}
        </button>
        {isOpen && <div className="card absolute fadeInFast w-30 z-10">{errorMsg}</div>}
      </div>
    );
  };

  export default ValidationIndicator