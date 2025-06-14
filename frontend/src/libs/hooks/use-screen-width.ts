"use client"
import { useState, useEffect } from "react"

export function useScreenWidth(initialWidth?: number) {
  const [width, setWidth] = useState<number>(initialWidth || 0)

  useEffect(() => {
    const handleResize = () => setWidth(document.documentElement.clientWidth);
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}