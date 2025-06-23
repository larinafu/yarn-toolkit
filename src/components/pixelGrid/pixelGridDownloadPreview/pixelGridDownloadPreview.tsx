import Image from "next/image";
import useModalTools from "@/hooks/general/useModalTools";
import {
  PixelGridCanvasCellDimensions,
  PixelGridCanvasNumRowsAndCols,
  PixelGridCanvasSavedData,
} from "@/types/pixelGrid";
import { useRef, useState } from "react";
import useEffectWithContainerDimensions from "@/hooks/general/useEffectWithContainerDims";
import canvasContextUtils from "@/utils/pixelGrid/canvasContextUtils";
import canvasSizingUtils from "@/utils/pixelGrid/canvasSizingUtils";
import { SpecialShape } from "@/hooks/pixelGrid/usePixelGridSpecialShapesCanvasTools";
import useThrottler from "@/hooks/general/useThrottler";
import SpinnerSmall from "@/components/general/spinnerSmall/spinnerSmall";

const PixelGridPreviewDisplay = ({
  savedCanvasDataRef,
  specialShapesRef,
  gridLineColor,
}: {
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  specialShapesRef: React.RefObject<SpecialShape[]>;
  gridLineColor: string;
}) => {
  const previewRef = useRef<any>(null);
  const container = useEffectWithContainerDimensions((rect) => {
    if (previewRef.current && rect) {
      const ctx = previewRef.current.getContext("2d");
      canvasContextUtils.drawFullCanvasPreview({
        maxPxWidth: 2000,
        maxPxHeight: 2000,
        savedCanvasData: savedCanvasDataRef.current,
        specialShapes: specialShapesRef.current,
        ref: previewRef,
        ctx,
        gridLineColor,
      });
    }
  });
  return (
    <div
      ref={container.ref}
      className="bg-gray-300 overflow-auto border-2 border-amaranth rounded-xl lg:w-4/5"
    >
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
  const ModalTools = useModalTools();
  const [sizeSelection, setSizeSelection] = useState<sizer>("s");
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
      maxPxWidth: 250,
      maxPxHeight: 250,
      dimensions: canvasSizingUtils.getMaxCanvasDimensions({
        canvasNumRowsAndCols,
        canvasCellWidthHeightRatio,
        maxPxWidth: 250,
        maxPxHeight: 250,
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
  const generateImage = async (width: number, height: number) => {
    const offscreenCanvas = new OffscreenCanvas(width, height);
    const offscreenCanvasCtx = offscreenCanvas.getContext("2d");
    canvasContextUtils.drawFullCanvasPreview({
      maxPxWidth: width,
      maxPxHeight: height,
      savedCanvasData: savedCanvasDataRef.current,
      specialShapes: specialShapesRef.current,
      ctx: offscreenCanvasCtx as OffscreenCanvasRenderingContext2D,
    });
    const blob = await offscreenCanvas.convertToBlob();
    return blob;
  };
  const [blob, setBlob] = useState<string | null>();

  const generateBlob = useThrottler(async (width: number, height: number) => {
    const blob = await generateImage(width, height);
    setBlob(URL.createObjectURL(blob));
  });

  return (
    <>
      <ModalTools.btn>
        <div className="">
          <Image
            src="/download.svg"
            alt="preview pattern"
            height={25}
            width={25}
          />
        </div>
      </ModalTools.btn>
      <ModalTools.modal className="size-4/5">
        <div className="p-1 size-full flex flex-col">
          <h2 className="text-2xl lg:text-3xl text-center">Download as PNG</h2>
          <div className="flex flex-col lg:flex-row overflow-auto">
            <PixelGridPreviewDisplay
              savedCanvasDataRef={savedCanvasDataRef}
              specialShapesRef={specialShapesRef}
              gridLineColor={gridLineColor}
            />
            <form className="h-fit mt-auto mb-auto lg:ml-4">
              <fieldset>
                <legend className="text-2xl lg:text-3xl">Select an image size:</legend>
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
                        onChange={async () => {
                          setSizeSelection(size);
                          setTimeout(async () => {
                            const blob = await generateImage(
                              sizeInfo.dimensions.width,
                              sizeInfo.dimensions.height
                            );
                            setBlob(URL.createObjectURL(blob));
                          }, 2000);
                        }}
                        className="absolute opacity-0"
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
                <a href={blob} className="button block w-fit" download={"pattern"}>
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
