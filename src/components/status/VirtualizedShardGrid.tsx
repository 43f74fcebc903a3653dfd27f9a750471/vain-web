"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ShardPill } from "./ShardPill";
import { ShardPillSkeleton } from "./SkeletonCard";

interface Shard {
  id: number;
  latency: number;
  guilds: number;
  users: number;
  uptime: number;
}

interface VirtualizedShardGridProps {
  shards: Shard[];
  highlightedShard: number | null;
  isLoading?: boolean;
}

export const VirtualizedShardGrid = ({
  shards,
  highlightedShard,
  isLoading = false,
}: VirtualizedShardGridProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [columnsCount, setColumnsCount] = useState(3);

  const getColumnsCount = () => {
    if (typeof window === "undefined") return 3;
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 1024) return 2;
    return 3;
  };

  useEffect(() => {
    const updateColumns = () => setColumnsCount(getColumnsCount());
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const rows = useMemo(() => {
    const items = isLoading ? Array(12).fill(null) : shards;
    const result = [];
    for (let i = 0; i < items.length; i += columnsCount) {
      result.push(items.slice(i, i + columnsCount));
    }
    return result;
  }, [shards, columnsCount, isLoading]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  if (shards.length <= 12 && !isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {shards.map((shard) => (
          <ShardPill
            key={shard.id}
            shard={shard}
            isHighlighted={shard.id === highlightedShard}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="h-[240px] overflow-auto"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.1) transparent",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 h-full">
              {rows[virtualRow.index]?.map((shard, colIndex) =>
                isLoading ? (
                  <ShardPillSkeleton
                    key={`skeleton-${virtualRow.index}-${colIndex}`}
                  />
                ) : (
                  <ShardPill
                    key={shard.id}
                    shard={shard}
                    isHighlighted={shard.id === highlightedShard}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
