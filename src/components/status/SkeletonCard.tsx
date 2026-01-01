"use client";

import { motion } from "framer-motion";

const shimmer = {
  animate: {
    x: ["0%", "100%", "0%"],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const StatusCardSkeleton = () => (
  <div className="bg-white/[0.01] border border-white/5 rounded-md p-2 flex items-center overflow-hidden relative">
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full"
      {...shimmer}
    />
    <div className="p-1 rounded-md bg-vain-primary/10 border border-vain-primary/20 mr-2">
      <div className="w-4 h-4 bg-white/20 rounded" />
    </div>
    <div>
      <div className="w-16 h-[10px] bg-white/10 rounded mb-0.5" />
      <div className="w-12 h-[12px] bg-white/10 rounded" />
    </div>
  </div>
);

export const ClusterCardSkeleton = () => (
  <div className="bg-[#0A0B0B] border border-white/10 rounded-lg overflow-hidden relative">
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full"
      {...shimmer}
    />
    <div className="py-2 pl-2 pr-1 flex items-center justify-between">
      <div className="flex items-center sm:justify-start flex-1 sm:flex-initial">
        <div className="bg-vain-primary/10 p-1.5 rounded-md border border-vain-primary/20 mr-3">
          <div className="w-3 h-3 bg-white/20 rounded" />
        </div>
        <div className="text-center sm:text-left flex-1 sm:flex-initial">
          <div className="w-20 h-[14px] bg-white/10 rounded mb-1" />
          <div className="w-32 h-[12px] bg-white/10 rounded" />
        </div>
      </div>
      <div className="flex items-center space-x-3 mr-6">
        <div className="text-right hidden sm:block">
          <div className="w-8 h-[10px] bg-white/10 rounded mb-1" />
          <div className="w-12 h-[12px] bg-white/10 rounded" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="w-12 h-[10px] bg-white/10 rounded mb-1" />
          <div className="w-10 h-[12px] bg-white/10 rounded" />
        </div>
        <div className="w-3 h-3 bg-white/10 rounded" />
      </div>
    </div>
  </div>
);

export const ShardPillSkeleton = () => (
  <div
    className="relative overflow-hidden w-full h-8 border border-white/5 px-3 py-1 flex items-center justify-between"
    style={{ borderRadius: "10px", background: "transparent" }}
  >
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -left-8 top-0 w-[250px] h-full">
        <div className="w-full h-full bg-gradient-to-r from-white/[0.03] via-white/[0.01] to-transparent" />
      </div>
    </div>
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full"
      {...shimmer}
    />
    <div className="flex items-center gap-2">
      <div className="w-12 h-[12px] bg-white/20 rounded" />
      <div className="w-16 h-[10px] bg-white/10 rounded hidden sm:inline" />
    </div>
    <div className="w-8 h-[12px] bg-white/20 rounded" />
  </div>
);
