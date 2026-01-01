"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { AvatarHistoryItem } from "@/lib/actions";
import { AvatarModal } from "./AvatarModal";

interface AvatarGridProps {
  avatars: AvatarHistoryItem[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  isLoading?: boolean;
}

export const AvatarGrid = ({
  avatars,
  currentPage,
  itemsPerPage,
  totalPages,
  isLoading = false,
}: AvatarGridProps) => {
  const [selectedAvatar, setSelectedAvatar] =
    useState<AvatarHistoryItem | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1024 });
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateDimensions = useCallback(() => {
    const newWidth = window.innerWidth;
    setDimensions((prev) => {
      if (Math.abs(prev.width - newWidth) > 50) {
        return { width: newWidth };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    updateDimensions();
    const handler = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(updateDimensions, 150);
    };
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [updateDimensions]);

  const gridCols = useMemo(() => {
    const width = dimensions.width;
    let cols: number;

    if (width < 640) cols = 2;
    else if (width < 768) cols = 3;
    else if (width < 1024) cols = 4;
    else if (width < 1280) cols = 5;
    else if (width < 1536) cols = 6;
    else cols = 7;

    return `repeat(${cols}, minmax(0, 1fr))`;
  }, [dimensions.width]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy • HH:mm");
    } catch {
      return "Unknown date";
    }
  };

  const paginatedAvatars = useMemo(
    () =>
      avatars.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [avatars, currentPage, itemsPerPage]
  );

  if (isLoading) {
    return (
      <div
        className="grid gap-2 mb-8"
        style={{ gridTemplateColumns: gridCols }}
      >
        {[...Array(itemsPerPage)].map((_, i) => (
          <div
            key={i}
            className="bg-white/[0.02] border border-white/10 rounded-md overflow-hidden"
          >
            <div className="aspect-square bg-white/5 animate-pulse" />
            <div className="p-2 border-t border-white/10 bg-white/[0.01]">
              <div className="h-3 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (avatars.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 border border-white/5 rounded-md bg-white/[0.01]">
        <p className="text-white/60">
          No avatar history tracked by vain for this user.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className="grid gap-2 mb-8"
        style={{ gridTemplateColumns: gridCols }}
      >
        {paginatedAvatars.map((item) => (
          <motion.div
            key={item.timestamp}
            className="bg-white/[0.02] border border-white/10 rounded-md overflow-hidden cursor-pointer hover:border-vain-primary/30 hover:shadow-sm hover:shadow-vain-primary/5 transition-all duration-200"
            onClick={() => setSelectedAvatar(item)}
          >
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
              <Image
                src={item.avatar_url}
                alt={`Avatar from ${formatDate(item.timestamp)}`}
                fill
                className="object-cover opacity-0 transition-opacity duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                priority={false}
                unoptimized={false}
                onLoadingComplete={(img) => {
                  img.classList.remove("opacity-0");
                  img.classList.add("opacity-100");
                }}
              />
            </div>
            <div className="p-2 border-t border-white/10 bg-white/[0.01]">
              <p className="text-white/60 text-xs truncate">
                {formatDate(item.timestamp)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedAvatar && (
          <AvatarModal
            avatar={selectedAvatar}
            onClose={() => setSelectedAvatar(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export const MemoizedAvatarGrid = React.memo(AvatarGrid);
