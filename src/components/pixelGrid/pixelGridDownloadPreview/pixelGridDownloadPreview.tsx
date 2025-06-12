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

const PixelGridPreviewDisplay = ({
  savedCanvasDataRef,
}: {
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
}) => {
  const previewRef = useRef<any>(null);
  const container = useEffectWithContainerDimensions((rect) => {
    if (previewRef.current && rect) {
      const ctx = previewRef.current.getContext("2d");
      canvasContextUtils.drawFullCanvasPreview({
        maxPxWidth: rect.width,
        maxPxHeight: rect.height,
        savedCanvasData: savedCanvasDataRef.current,
        ref: previewRef,
        ctx,
      });
    }
  });
  return (
    <div ref={container.ref} className="w-1/2 h-4/5">
      <canvas ref={previewRef}></canvas>
    </div>
  );
};

type sizer = "s" | "m" | "l";

export default function PixelGridDownloadPreview({
  savedCanvasDataRef,
  canvasNumRowsAndCols,
  canvasCellWidthHeightRatio,
}: {
  savedCanvasDataRef: React.RefObject<PixelGridCanvasSavedData>;
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
      ctx: offscreenCanvasCtx as OffscreenCanvasRenderingContext2D,
    });
    const blob = await offscreenCanvas.convertToBlob();
    return blob;
  };
  const [blob, setBlob] = useState<string>();

  return (
    <>
      <ModalTools.btn>
        <div className="card">
          <Image src="/eye.svg" alt="preview pattern" height={25} width={25} />
        </div>
      </ModalTools.btn>
      <ModalTools.modal>
        <h2>Pattern Preview</h2>
        <div className="flex">
          <PixelGridPreviewDisplay savedCanvasDataRef={savedCanvasDataRef} />
          <form>
            <fieldset>
              <legend>Select an image size:</legend>
              {(Object.entries(sizesInfo) as [sizer, any][]).map(
                ([size, sizeInfo]) => (
                  <div
                    key={size}
                    onClick={async () => {
                      setSizeSelection(size);
                      const blob = await generateImage(
                        sizeInfo.dimensions.width,
                        sizeInfo.dimensions.height
                      );
                      setBlob(URL.createObjectURL(blob));
                    }}
                  >
                    <input
                      type="radio"
                      id={size}
                      name={size}
                      value={size}
                      checked={size === sizeSelection}
                      onChange={async () => {
                        setSizeSelection(size);
                        const blob = await generateImage(
                          sizeInfo.dimensions.width,
                          sizeInfo.dimensions.height
                        );
                        setBlob(URL.createObjectURL(blob));
                      }}
                    />
                    <label htmlFor={size}>
                      {sizeInfo.display} - {sizeInfo.dimensions.width}x
                      {sizeInfo.dimensions.height}px
                    </label>
                  </div>
                )
              )}
            </fieldset>
            <a href={blob} className="button" download={"pattern"}>
              download image
            </a>
          </form>
        </div>
      </ModalTools.modal>
    </>
  );
}
