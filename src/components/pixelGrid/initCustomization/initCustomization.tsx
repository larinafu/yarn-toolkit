import React, { useMemo, useRef, useState } from "react";
import {
  ImageInfo,
  PatternSize,
  PatternSizeDisplay,
  PixelGridCanvasSavedData,
  SwatchInputs,
} from "@/types/pixelGrid";

import ProjectSizeInputs from "../projectSizeInputs/projectSizeInputs";
import Spinner from "@/components/general/spinner/spinner";
import InitPixelGridPreview from "../initPixelGridPreview/initPixelGridPreview";
import GaugeSwatchInputs from "../gaugeSwatchInputs/gaugeSwatchInputs";
import SpinnerSmall from "@/components/general/spinnerSmall/spinnerSmall";
import { useRouter } from "next/navigation";
import {
  isValidProjectSize,
  PROJ_SIZE_LIMIT,
} from "@/utils/general/inputValidationUtils";
import {
  getInitialPatternSize,
  getPatternSizeHeightLimited,
  getPatternSizeWidthLimited,
} from "@/utils/pixelGrid/initGridSizeUtils";
import {
  generateNewPixelGrid,
  generateNewPixelGridNoImage,
} from "@/utils/pixelGrid/gridGeneratorUtils";
import { SAVED_CANVAS_DATA_LOC } from "@/constants/pixelGrid/sessionStorage";

export default function InitCustomization({
  imageInfo,
}: {
  imageInfo?: ImageInfo;
}) {
  const router = useRouter();
  const [isValidForm, setValidForm] = useState(true);
  const [swatch, setSwatch] = useState({ width: 1, height: 1 });
  const [swatchInputs, setSwatchInputs] = useState<SwatchInputs>({
    width: "1",
    height: "1",
  });
  const widthHeightRatio = swatch.width / swatch.height;
  const [patternSize, setPatternSize] = useState<PatternSize>(
    imageInfo
      ? getInitialPatternSize(
          75,
          widthHeightRatio,
          imageInfo.imageData.width,
          imageInfo.imageData.height
        )
      : { numRows: 50, numCols: 50 }
  );
  const [patternSizeInputs, setPatternSizeInputs] =
    useState<PatternSizeDisplay>(patternSize);
  const [basePattern, setBasePattern] = useState<{ hex: string }[][]>(
    imageInfo
      ? generateNewPixelGrid({
          imgData: imageInfo.imageData,
          swatch,
          numRows: patternSize.numRows,
          numStitches: patternSize.numCols,
        })
      : generateNewPixelGridNoImage(patternSize)
  );
  const throttleContent = useRef<number>(null);
  const canvasRef = useRef(null);
  const [isGaugeChangeLoading, setGaugeChangeLoading] = useState(false);
  const [isSizeChangeLoading, setSizeChangeLoading] = useState(false);
  const [isPatternCreating, setPatternCreating] = useState(false);

  const updatePatternFromGaugeChange = (width: number, height: number) => {
    let acceptedProjSize = { numRows: 0, numCols: 0 };
    if (imageInfo) {
      // row limited
      const rowLimitedPatternSize = getPatternSizeHeightLimited(
        patternSize.numRows,
        width / height,
        imageInfo.imageData.width,
        imageInfo.imageData.height
      );
      if (isValidProjectSize(rowLimitedPatternSize).isValid) {
        acceptedProjSize = {
          numRows: rowLimitedPatternSize.numRows,
          numCols: rowLimitedPatternSize.numCols,
        };
      }

      // col limited
      const colLimitedPatternSize = getPatternSizeWidthLimited(
        patternSize.numCols,
        width / height,
        imageInfo.imageData.width,
        imageInfo.imageData.height
      );
      if (isValidProjectSize(colLimitedPatternSize).isValid) {
        if (
          acceptedProjSize.numRows * acceptedProjSize.numCols <
          colLimitedPatternSize.numRows * colLimitedPatternSize.numCols
        )
          acceptedProjSize = {
            numRows: colLimitedPatternSize.numRows,
            numCols: colLimitedPatternSize.numCols,
          };
      }

      if (acceptedProjSize.numRows + acceptedProjSize.numCols === 0) {
        acceptedProjSize = getInitialPatternSize(
          PROJ_SIZE_LIMIT,
          width / height,
          imageInfo.imageData.width,
          imageInfo.imageData.height
        );
      }
    } else {
      acceptedProjSize = patternSize;
    }
    
    clearTimeout(throttleContent.current);
    setGaugeChangeLoading(true);
    const timer: number = window.setTimeout(() => {
      setPatternSize(acceptedProjSize);
      setPatternSizeInputs(acceptedProjSize);
      setSwatch({
        width,
        height,
      });
      if (imageInfo) {
        setBasePattern(
          generateNewPixelGrid({
            imgData: imageInfo.imageData,
            swatch: { width, height },
            numStitches: acceptedProjSize.numCols,
            numRows: acceptedProjSize.numRows,
          })
        );
      } else {
        setBasePattern(generateNewPixelGridNoImage(acceptedProjSize));
      }
      setGaugeChangeLoading(false);
      setValidForm(true);
    }, 2000);
    throttleContent.current = timer;
  };

  const updatePatternFromSizeChange = (patternSize: PatternSize) => {
    clearTimeout(throttleContent.current);
    setSizeChangeLoading(true);
    const timer = window.setTimeout(() => {
      setPatternSize(patternSize);
      if (imageInfo) {
        setBasePattern(
          generateNewPixelGrid({
            imgData: imageInfo.imageData,
            swatch,
            numStitches: patternSize.numCols,
            numRows: patternSize.numRows,
          })
        );
      } else {
        setBasePattern(generateNewPixelGridNoImage(patternSize));
      }

      setSizeChangeLoading(false);
      setValidForm(true);
    }, 2000);
    throttleContent.current = timer;
  };

  const savedCanvasData: PixelGridCanvasSavedData = useMemo(
    () => ({
      pixels: basePattern,
      swatch,
      previewImg: "",
      numberFormat: "numbersBetween",
    }),
    [swatch, basePattern]
  );

  const handlePatternCreate = async () => {
    setPatternCreating(true);
    const patternObj: PixelGridCanvasSavedData = {
      pixels: basePattern,
      swatch,
      previewImg: "",
      numberFormat: "numbersBetween",
    };
    window.sessionStorage.setItem(
      SAVED_CANVAS_DATA_LOC,
      JSON.stringify(patternObj)
    );
    router.push("/projects/new");
  };

  return (
    <section className="fadeIn h-dvh flex flex-col pt-10">
      <div>
        <h2 className="text-center text-4xl md:text-5xl mt-6 mb-2">
          Chart Preview
        </h2>
        <p className="text-center text-2xl md:text-3xl ml-1 mr-1 mb-6">
          We need a few more details to generate your starting pattern.
        </p>
      </div>
      <div className="grow flex flex-col sm:flex-row overflow-auto">
        <div className="flex flex-row shrink-0 sm:flex-col sm:w-3/12 min-w-xs pr-2 pl-2 overflow-auto">
          <section className="card m-2 shrink-0 h-fit">
            <GaugeSwatchInputs
              size={150}
              swatchInputs={swatchInputs}
              setSwatchInputs={setSwatchInputs}
              updatePatternFromGaugeChange={updatePatternFromGaugeChange}
              throttleContent={throttleContent}
              setGaugeChangeLoading={setGaugeChangeLoading}
              isSizeChangeLoading={isSizeChangeLoading}
              setValidForm={setValidForm}
            />
          </section>
          <section className="card m-2 shrink-0">
            <ProjectSizeInputs
              widthHeightRatio={widthHeightRatio}
              patternSizeInputs={patternSizeInputs}
              setPatternSizeInputs={setPatternSizeInputs}
              aspectRatio={imageInfo?.imageData}
              isGaugeChangeLoading={isGaugeChangeLoading}
              throttleContent={throttleContent}
              setSizeChangeLoading={setSizeChangeLoading}
              updatePatternFromSizeChange={updatePatternFromSizeChange}
              setValidForm={setValidForm}
            />
          </section>
        </div>
        <section
          className={`relative m-auto w-full h-full overflow-auto md:w-8/12`}
        >
          {(isGaugeChangeLoading || isSizeChangeLoading) && (
            <div className="p-2 absolute top-2 right-2 rounded-b-full bg-amaranth">
              <Spinner color={"#fff"} isSpinning />
            </div>
          )}
          <InitPixelGridPreview
            canvasRef={canvasRef}
            savedCanvasData={savedCanvasData}
          />
        </section>
      </div>
      <button
        className="block sticky text-2xl bottom-2 m-2 w-max ml-auto"
        disabled={!isValidForm || isPatternCreating}
        onClick={handlePatternCreate}
      >
        {isPatternCreating ? (
          <div className="flex items-center">
            <p>Creating...</p>
            <div className="mg-l-xs">
              <SpinnerSmall />
            </div>
          </div>
        ) : (
          <p>Go to chart maker!</p>
        )}
      </button>
    </section>
  );
}
