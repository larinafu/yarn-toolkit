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
}: {
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  specialShapesRef: React.RefObject<SpecialShape[]>;
}) => {
  const previewRef = useRef<any>(null);
  const container = useEffectWithContainerDimensions((rect) => {
    if (previewRef.current && rect) {
      const ctx = previewRef.current.getContext("2d");
      canvasContextUtils.drawFullCanvasPreview({
        maxPxWidth: rect.width,
        maxPxHeight: rect.height,
        savedCanvasData: savedCanvasDataRef.current,
        specialShapes: specialShapesRef.current,
        ref: previewRef,
        ctx,
      });
    }
  });
  return (
    <div ref={container.ref} className="grow">
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
}: {
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
  specialShapesRef: React.RefObject<SpecialShape[]>;
  canvasNumRowsAndCols: PixelGridCanvasNumRowsAndCols;
  canvasCellWidthHeightRatio: number;
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
        <div className="card">
          <Image src="/eye.svg" alt="preview pattern" height={25} width={25} />
        </div>
      </ModalTools.btn>
      <ModalTools.modal className="size-4/5">
        <h2 className="text-3xl text-center">Download as PNG</h2>
        <div className="flex h-4/5 w-full">
          <PixelGridPreviewDisplay
            savedCanvasDataRef={savedCanvasDataRef}
            specialShapesRef={specialShapesRef}
          />
          <form>
            <fieldset>
              <legend className="text-3xl">Select an image size:</legend>
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
                    className={`text-2xl p-2 rounded-lg last:mb-5 ${
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
              <a href={blob} className="button" download={"pattern"}>
                download image
              </a>
            ) : (
              <div className="button flex w-fit">
                <p className="mr-5">generating PNG</p> <SpinnerSmall />
              </div>
            )}
          </form>
        </div>
      </ModalTools.modal>
    </>
  );
}
