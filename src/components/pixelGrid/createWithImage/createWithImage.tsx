import React, { useRef, useState } from "react";
import imageCompression from "browser-image-compression";

import useScrollIntoView from "@/hooks/general/useScrollIntoView";
import SpinnerSmall from "@/components/general/spinnerSmall/spinnerSmall";
import InitCustomization from "../initCustomization/initCustomization";

import { ImageInfo } from "@/types/pixelGrid";

export default function CreateWithImage() {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [isImageUploadLoading, setImageUploadLoading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const additionalInfoRef = useRef(null);

  useScrollIntoView(additionalInfoRef, [imageInfo]);

  const handleFileUpload = async (e: any) => {
    if (imageInputRef.current?.files) {
      setImageUploadLoading(true);
      const imageFile = imageInputRef.current.files[0];
      if (imageFile) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 500,
          useWebWorker: true,
        };

        try {
          const compressedFile = await imageCompression(imageFile, options);
          const reader = new FileReader();
          const compressedImg = new Image();
          reader.readAsDataURL(compressedFile);
          reader.onloadend = function () {
            compressedImg.src = reader.result as string;
            compressedImg.onload = () => {
              const offscreenCanvasCtx = new OffscreenCanvas(
                compressedImg.width,
                compressedImg.height
              ).getContext("2d");
              if (offscreenCanvasCtx) {
                offscreenCanvasCtx.drawImage(compressedImg, 0, 0);
                const imageData = offscreenCanvasCtx.getImageData(
                  0,
                  0,
                  compressedImg.width,
                  compressedImg.height
                );

                setImageInfo({
                  src: reader.result as string,
                  fileName: e.target.value,
                  imageData,
                });
              }
              setImageUploadLoading(false);
            };
          };
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  return (
    <form className="fadeIn">
      <section>
        <label
          className={`button w-fit m-auto mt-10 mb-10 relative flex items-center hover:cursor-pointer`}
        >
          <p className="text-3xl">click to upload image</p>
          <input
            ref={imageInputRef}
            className="absolute w-0 h-0 opacity-0"
            type="file"
            name="image_uploads"
            accept="image/jpg, image/jpeg, image/png, image/heic"
            onChange={(e) => {
              handleFileUpload(e);
            }}
          />
          {isImageUploadLoading && (
            <div className="ml-2">
              <SpinnerSmall />
            </div>
          )}
        </label>
      </section>
      {imageInfo && (
        <div ref={additionalInfoRef}>
          <InitCustomization key={imageInfo.fileName} imageInfo={imageInfo} />
        </div>
      )}
    </form>
  );
}