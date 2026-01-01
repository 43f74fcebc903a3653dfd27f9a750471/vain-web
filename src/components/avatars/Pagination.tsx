"use client";

import { Pagination as HeroUIPagination } from "@heroui/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center py-8">
      <HeroUIPagination
        total={totalPages}
        page={currentPage}
        onChange={onPageChange}
        showControls
        size="lg"
        siblings={0}
        boundaries={1}
        classNames={{
          base: "bg-transparent",
          prev: "bg-black/20 border border-white/[0.08] text-white/70 hover:border-white/20 hover:text-white transition-all duration-200 relative",
          next: "bg-black/20 border border-white/[0.08] text-white/70 hover:border-white/20 hover:text-white transition-all duration-200 relative",
          item: "bg-black/20 border border-white/[0.08] text-white/70 hover:border-white/20 hover:text-white transition-all duration-200 relative",
          cursor:
            "bg-black/30 border border-white/20 text-white transition-all duration-200 relative",
          forwardIcon: "text-white/70",
          ellipsis: "text-white/70",
          chevronNext: "text-white/70",
        }}
      />
    </div>
  );
};
