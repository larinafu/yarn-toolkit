"use client";
import LoadingBackground from "@/components/general/loadingBackground/loadingBackground";
import PixelGridEditor from "@/components/pixelGrid/pixelGridEditor/pixelGridEditor";
import { SAVED_CANVAS_DATA_LOC } from "@/constants/pixelGrid/sessionStorage";
import { useEffect, useState } from "react";

export default function Project() {
  const [savedCanvasData, setSavedCanvasData] = useState(null);
  useEffect(() => {
    const savedCanvasData = window.sessionStorage.getItem(
      SAVED_CANVAS_DATA_LOC
    );
    if (savedCanvasData) {
      setSavedCanvasData(JSON.parse(savedCanvasData));
    }
  }, []);
  return savedCanvasData ? (
    <PixelGridEditor savedCanvasData={savedCanvasData} />
  ) : (
    <LoadingBackground />
  );
}
