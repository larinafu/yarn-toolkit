import styles from "./spinner.module.css";

const SPINNER_SIZE = 30;
const SPINNER_PADDING = 4;
const SPINNER_STROKE_WIDTH = 4;
const SPINNER_X_END = (SPINNER_SIZE * 2) / 3;
const SPINNER_Y_END =
  SPINNER_SIZE -
  (((SPINNER_SIZE / 2) ** 2 - (SPINNER_X_END - SPINNER_SIZE / 2) ** 2) ** 0.5 +
    SPINNER_SIZE / 2);
const SPINNER_X1_END = SPINNER_SIZE / 3;
const SPINNER_Y1_END =
  ((SPINNER_SIZE / 2) ** 2 - (SPINNER_X1_END - SPINNER_SIZE / 2) ** 2) ** 0.5 +
  SPINNER_SIZE / 2;

const SPINNER2_SIZE = SPINNER_SIZE / 2;
const SPINNER2_PADDING = SPINNER_PADDING / 2;
const SPINNER2_STROKE_WIDTH = SPINNER_STROKE_WIDTH;
const SPINNER2_X_END = (SPINNER2_SIZE * 2) / 3;
const SPINNER2_Y_END =
  SPINNER2_SIZE -
  (((SPINNER2_SIZE / 2) ** 2 - (SPINNER2_X_END - SPINNER2_SIZE / 2) ** 2) **
    0.5 +
    SPINNER2_SIZE / 2);
const SPINNER2_X1_END = SPINNER2_SIZE / 3;
const SPINNER2_Y1_END =
  ((SPINNER2_SIZE / 2) ** 2 - (SPINNER2_X1_END - SPINNER2_SIZE / 2) ** 2) **
    0.5 +
  SPINNER2_SIZE / 2;

export default function Spinner({
  color,
  isSpinning,
}: {
  color: string;
  isSpinning: boolean;
}) {
  return (
    <div className="relative w-fit h-fit">
      <svg
        className={`${isSpinning ? styles.outerSpinner : ""}`}
        width={SPINNER_SIZE + SPINNER_PADDING * 2}
        height={SPINNER_SIZE + SPINNER_PADDING * 2}
      >
        <path
          d={`M ${SPINNER_PADDING} ${SPINNER_SIZE / 2 + SPINNER_PADDING} A ${
            SPINNER_SIZE / 2
          } ${SPINNER_SIZE / 2} 1 0 1 ${SPINNER_X_END + SPINNER_PADDING} ${
            SPINNER_Y_END + SPINNER_PADDING
          }`}
          stroke={color}
          fill="none"
          strokeWidth={SPINNER_STROKE_WIDTH}
          strokeLinecap="round"
        />

        <path
          d={`M ${SPINNER_PADDING + SPINNER_SIZE} ${
            SPINNER_SIZE / 2 + SPINNER_PADDING
          } A ${SPINNER_SIZE / 2} ${SPINNER_SIZE / 2} 1 0 1 ${
            SPINNER_X1_END + SPINNER_PADDING
          } ${SPINNER_Y1_END + SPINNER_PADDING}`}
          stroke={color}
          fill="none"
          strokeWidth={SPINNER_STROKE_WIDTH}
          strokeLinecap="round"
        />
      </svg>
      <svg
        className={`absolute top-1/4 left-1/4 rotate-12 origin-center ${
          isSpinning ? styles.innerSpinning : ""
        }`}
        width={SPINNER2_SIZE + SPINNER2_PADDING * 2}
        height={SPINNER2_SIZE + SPINNER2_PADDING * 2}
      >
        <path
          d={`M ${SPINNER2_PADDING} ${SPINNER2_SIZE / 2 + SPINNER2_PADDING} A ${
            SPINNER2_SIZE / 2
          } ${SPINNER2_SIZE / 2} 1 0 1 ${SPINNER2_X_END + SPINNER2_PADDING} ${
            SPINNER2_Y_END + SPINNER2_PADDING
          }`}
          stroke={color}
          fill="none"
          strokeWidth={SPINNER2_STROKE_WIDTH}
          strokeLinecap="round"
        />

        <path
          d={`M ${SPINNER2_PADDING + SPINNER2_SIZE} ${
            SPINNER2_SIZE / 2 + SPINNER2_PADDING
          } A ${SPINNER2_SIZE / 2} ${SPINNER2_SIZE / 2} 1 0 1 ${
            SPINNER2_X1_END + SPINNER2_PADDING
          } ${SPINNER2_Y1_END + SPINNER2_PADDING}`}
          stroke={color}
          fill="none"
          strokeWidth={SPINNER2_STROKE_WIDTH}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
