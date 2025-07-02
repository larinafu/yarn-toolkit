"use client";
import LoadingBackground from "@/components/general/loadingBackground/loadingBackground";
import PixelGridEditor from "@/components/pixelGrid/pixelGridEditor/pixelGridEditor";
import { SAVED_CANVAS_DATA_LOC } from "@/constants/pixelGrid/sessionStorage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Project() {
  const router = useRouter();
  const [savedCanvasData, setSavedCanvasData] = useState(null);
  useEffect(() => {
    const savedCanvasData = window.sessionStorage.getItem(
      SAVED_CANVAS_DATA_LOC
    );
    if (savedCanvasData) {
      setSavedCanvasData(JSON.parse(savedCanvasData));
    } else {
      router.push("/create");
    }
  }, []);
  return savedCanvasData ? (
    <PixelGridEditor savedCanvasData={savedCanvasData} />
  ) : (
    <LoadingBackground />
  );
}
