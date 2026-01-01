"use client";

import { useMemo, useRef, useCallback, useState } from "react";
import type { CSSProperties } from "react";
import bg1 from "@/assets/bg/1.png";
import bg2 from "@/assets/bg/2.png";
import bg3 from "@/assets/bg/3.png";
import bg4 from "@/assets/bg/4.png";
import bg5 from "@/assets/bg/5.png";
import bg6 from "@/assets/bg/6.png";
import bg7 from "@/assets/bg/7.png";
import bg8 from "@/assets/bg/8.png";
import bg9 from "@/assets/bg/9.png";
import styles from "@/components/ui/css/mesh.module.css";

const backgrounds = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9];

const getOptimizedUrl = (src: string) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=3840&q=100`;

const blobCache = new Map<string, string>();
const sessionSeed = Math.floor(Math.random() * backgrounds.length);

const createOptimizedBlob = async (src: string): Promise<string> => {
  if (blobCache.has(src)) return blobCache.get(src)!;

  try {
    const response = await fetch(src);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    blobCache.set(src, blobUrl);
    return blobUrl;
  } catch {
    return src;
  }
};

const preloadSelectedImage = (src: string) => {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;
  document.head.appendChild(link);
};

export function MeshGradient() {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const selectedBg = useMemo(() => backgrounds[sessionSeed], []);
  const optimizedUrl = useMemo(
    () => getOptimizedUrl(selectedBg.src),
    [selectedBg.src]
  );

  const blobUrl = useMemo(() => {
    preloadSelectedImage(optimizedUrl);
    createOptimizedBlob(optimizedUrl).then((blob) => {
      if (imgRef.current) {
        imgRef.current.src = blob;
      }
    });
    return optimizedUrl;
  }, [optimizedUrl]);

  const handleLoad = useCallback(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, []);

  return (
    <aside className={styles.container}>
      <img
        ref={imgRef}
        src={blobUrl}
        width={1200}
        height={560}
        alt=""
        className={`${styles.image} ${loaded ? styles.loaded : ""}`}
        onLoad={handleLoad}
        aria-hidden
        draggable={false}
        decoding="async"
        fetchPriority="high"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        suppressContentEditableWarning={true}
        suppressHydrationWarning={true}
      />

      <div className={styles.overlay} aria-hidden />
    </aside>
  );
}
