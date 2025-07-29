import { useState, useRef, useEffect } from "react";

type DropdownProps = {
  btnContent: React.ReactNode;
  children: React.ReactNode;
  singleClickClose?: boolean;
};

export default function Dropdown({
  btnContent,
  children,
  singleClickClose = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    const dropdown = dropdownRef.current;

    if (!buttonRect || !dropdown) return;

    const dropdownRect = dropdown.getBoundingClientRect();
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    // Try placing dropdown below the button
    let top = buttonRect.bottom;
    if (top + dropdownRect.height > screenHeight) {
      // Not enough space below → try above
      const aboveTop = buttonRect.top - dropdownRect.height;
      top =
        aboveTop >= 0
          ? aboveTop
          : Math.max(screenHeight - dropdownRect.height, 0);
    }

    // Calculate horizontal placement
    let left = buttonRect.left;
    if (left + dropdownRect.width > screenWidth) {
      left = Math.max(screenWidth - dropdownRect.width - 10, 10); // clamp right edge
    }

    setPosition({ top, left });
  };

  const handleDropdownClick = () => {
    if (singleClickClose) setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();

      const handleResize = () => updatePosition();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        !buttonRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="buttonBlank p-0"
      >
        {btnContent}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          onClick={handleDropdownClick}
          className="fixed z-50 p-2"
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          {children}
        </div>
      )}
    </>
  );
}
