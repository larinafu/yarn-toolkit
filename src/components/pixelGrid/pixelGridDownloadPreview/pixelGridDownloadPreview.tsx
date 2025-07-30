import Image from "next/image";
import useModalTools from "@/hooks/general/useModalTools";
import {
  PixelGridCanvasCellDimensions,
  PixelGridCanvasDimensions,
  PixelGridCanvasNumRowsAndCols,
  PixelGridCanvasSavedData,
} from "@/types/pixelGrid";
import { useEffect, useRef, useState } from "react";
import canvasContextUtils from "@/utils/pixelGrid/canvasContextUtils";
import canvasSizingUtils from "@/utils/pixelGrid/canvasSizingUtils";
import { SpecialShape } from "@/hooks/pixelGrid/usePixelGridSpecialShapesCanvasTools";
import useThrottler from "@/hooks/general/useThrottler";
import SpinnerSmall from "@/components/general/spinnerSmall/spinnerSmall";

const PixelGridPreviewDisplay = ({
  savedCanvasDataRef,
  specialShapesRef,
  gridLineColor,
  gridDims,
  previewRef,
}: {
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  specialShapesRef: React.RefObject<SpecialShape[]>;
  gridLineColor: string;
  gridDims: PixelGridCanvasDimensions;
  previewRef: React.RefObject<HTMLCanvasElement>;
}) => {
  useEffect(() => {
    const ctx = previewRef.current.getContext("2d");
    if (ctx) {
      canvasContextUtils.drawFullCanvasPreview({
        maxPxWidth: gridDims.width,
        maxPxHeight: gridDims.height,
        savedCanvasData: savedCanvasDataRef.current,
        specialShapes: specialShapesRef.current,
        ref: previewRef,
        ctx,
        gridLineColor,
        includeWatermark: true,
      });
    }
  }, [gridDims.width, gridDims.height]);
  return (
    <div className="grow bg-gray-300 overflow-auto border-2 border-amaranth rounded-xl lg:w-4/5">
      <canvas ref={previewRef}></canvas>
    </div>
  );
};

type sizer = "s" | "m" | "l";

export default function PixelGridDownloadPreview({
  savedCanvasDataRef,
  specialShapesRef,
  canvasNumRowsAndCols,
  canvasCellWidthHeightRatio,
  gridLineColor,
}: {
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  specialShapesRef: React.RefObject<SpecialShape[]>;
  canvasNumRowsAndCols: PixelGridCanvasNumRowsAndCols;
  canvasCellWidthHeightRatio: number;
  gridLineColor: string;
}) {
  const previewRef = useRef<any>(null);
  const [sizeSelection, setSizeSelection] = useState<sizer>("m");
  const sizesInfo: {
    [size in sizer]: {
      display: string;
      dimensions: PixelGridCanvasCellDimensions;
      maxPxWidth: number;
      maxPxHeight: number;
    };
  } = {
    s: {
      display: "small",
      maxPxWidth: 500,
      maxPxHeight: 500,
      dimensions: canvasSizingUtils.getMaxCanvasDimensions({
        canvasNumRowsAndCols,
        canvasCellWidthHeightRatio,
        maxPxWidth: 500,
        maxPxHeight: 500,
      }).gridDims,
    },
    m: {
      display: "medium",
      maxPxWidth: 1400,
      maxPxHeight: 1400,
      dimensions: canvasSizingUtils.getMaxCanvasDimensions({
        canvasNumRowsAndCols,
        canvasCellWidthHeightRatio,
        maxPxWidth: 1400,
        maxPxHeight: 1400,
      }).gridDims,
    },
    l: {
      display: "large",
      maxPxWidth: 2000,
      maxPxHeight: 2000,
      dimensions: canvasSizingUtils.getMaxCanvasDimensions({
        canvasNumRowsAndCols,
        canvasCellWidthHeightRatio,
        maxPxWidth: 2000,
        maxPxHeight: 2000,
      }).gridDims,
    },
  };

  const [blob, setBlob] = useState<string | null>();

  const generateBlob = useThrottler(() => {
    previewRef.current?.toBlob((blob: Blob) => {
      setBlob(URL.createObjectURL(blob));
    });
  });

  const ModalTools = useModalTools((isOpen) => {
    if (isOpen) {
      setBlob(null);
      generateBlob.throttle();
    }
  });

  return (
    <>
      <ModalTools.btn btnClass={"p-2 border-0 text-start sm:text-center"}>
        <span className="block text-black">Download</span>
      </ModalTools.btn>
      <ModalTools.modal className="size-4/5">
        <div className="p-1 size-full flex flex-col">
          <h2 className="text-2xl lg:text-3xl text-center">Download as PNG</h2>
          <div className="flex flex-col lg:flex-row overflow-auto h-full">
            <PixelGridPreviewDisplay
              savedCanvasDataRef={savedCanvasDataRef}
              specialShapesRef={specialShapesRef}
              gridLineColor={gridLineColor}
              gridDims={{
                width: sizesInfo[sizeSelection].dimensions.width,
                height: sizesInfo[sizeSelection].dimensions.height,
              }}
              previewRef={previewRef}
            />
            <form className="h-fit mt-auto mb-auto lg:ml-4">
              <fieldset>
                <legend className="text-2xl lg:text-3xl">
                  Select an image size:
                </legend>
                {(Object.entries(sizesInfo) as [sizer, any][]).map(
                  ([size, sizeInfo]) => (
                    <div
                      key={size}
                      onClick={async () => {
                        setSizeSelection(size);
                        setBlob(null);
                        generateBlob.throttle(
                          sizeInfo.dimensions.width,
                          sizeInfo.dimensions.height
                        );
                      }}
                      className={`text-xl lg:text:2xl p-2 rounded-lg last:mb-2 ${
                        size === sizeSelection && "bg-amaranth-light"
                      }`}
                    >
                      <input
                        type="radio"
                        id={size}
                        name={size}
                        value={size}
                        checked={size === sizeSelection}
                        className="absolute opacity-0"
                        readOnly
                      />
                      <label htmlFor={size}>
                        {sizeInfo.display} - {sizeInfo.dimensions.width}x
                        {sizeInfo.dimensions.height}px
                      </label>
                    </div>
                  )
                )}
              </fieldset>
              {blob ? (
                <a
                  href={blob}
                  className="button block w-fit"
                  download={"pattern"}
                >
                  download image
                </a>
              ) : (
                <div className="button flex w-fit">
                  <p className="mr-5">generating PNG</p> <SpinnerSmall />
                </div>
              )}
            </form>
          </div>
        </div>
      </ModalTools.modal>
    </>
  );
}
