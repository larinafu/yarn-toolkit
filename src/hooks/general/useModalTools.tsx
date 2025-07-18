import React, { useCallback, useEffect, useRef, useState } from "react";

import { useRefWithClickawayListener } from "./useRefWithClickawayListener";

export default function useModalTools(onOpen?: (isOpen: boolean) => void): {
  modal: any;
  btn: any;
} {
  const [isOpen, setOpen] = useState(false);
  const modalRef = useRefWithClickawayListener(() => {
    setOpen(false);
  }, [isOpen]);

  useEffect(() => {
    onOpen?.(isOpen);
  }, [isOpen]);

  const modal = useCallback(
    ({
      children,
      className,
    }: {
      children: React.ReactElement;
      className: string;
    }) =>
      isOpen && (
        <Modal
          innerRef={modalRef}
          onExit={() => setOpen(false)}
          className={className}
        >
          {children}
        </Modal>
      ),
    [isOpen]
  );
  const btn = useCallback(
    ({ children }: { children: React.ReactElement }) => (
      <button className="buttonBlank p-0" onClick={() => setOpen(true)}>
        {children}
      </button>
    ),
    []
  );
  return { modal, btn };
}

type ModalProps = {
  children: React.ReactElement;
  innerRef: React.RefObject<any>;
  onExit: () => void;
  className?: string;
  closeBtn?: boolean;
};

const Modal = ({
  children,
  innerRef,
  onExit,
  className,
  closeBtn,
}: ModalProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div className="fixed z-40 top-0 left-0 w-dvw h-dvh flex items-center justify-center bg-gray-50/50">
      <section
        className={`card max-w-4/5 max-h-4/5 ${className}`}
        ref={innerRef}
      >
        {children}{" "}
        {closeBtn && (
          <button onClick={onExit} className="block mt-0 mr-0 mb-auto ml-0">
            close
          </button>
        )}
      </section>
    </div>
  );
};
