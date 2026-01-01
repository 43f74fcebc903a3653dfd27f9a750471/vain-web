"use client";

import { motion } from "framer-motion";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { formatDistanceToNow } from "date-fns";

interface Shard {
  id: number;
  latency: number;
  guilds: number;
  users: number;
  uptime: number;
}

interface ShardPillProps {
  shard: Shard;
  isHighlighted: boolean;
}

const formatUptime = (uptime: number) => {
  const startTime = new Date(Date.now() - uptime * 1000);
  return formatDistanceToNow(startTime, { addSuffix: false });
};

const getPingColor = (latency: number) => {
  const ping = Math.round(latency * 1000);
  if (ping < 200) return "227, 227, 237";
  if (ping < 500) return "160, 143, 164";
  return "252, 165, 165";
};

export const ShardPill = ({ shard, isHighlighted }: ShardPillProps) => {
  const ping = Math.round(shard.latency * 1000);
  const color = getPingColor(shard.latency);
  const hasDetailedData =
    shard.guilds > 0 || shard.users > 0 || shard.uptime > 0;

  if (!hasDetailedData) {
    return (
      <motion.div className="group relative">
        <motion.div
          className="relative overflow-hidden w-full h-8 border border-white/5 px-3 py-1 flex items-center justify-between transition-all duration-200 group-hover:border-white/10 group-hover:bg-white/[0.01]"
          style={{
            borderRadius: "10px",
            background: "transparent",
          }}
          animate={
            isHighlighted
              ? {
                  boxShadow: [
                    "0 0 0 0px rgba(255,255,255,0.0)",
                    "0 0 0 2px rgba(255,255,255,0.2), 0 0 8px rgba(255,255,255,0.1)",
                    "0 0 0 0px rgba(255,255,255,0.0)",
                  ],
                  borderColor: [
                    "rgba(255,255,255,0.05)",
                    "rgba(255,255,255,0.4)",
                    "rgba(255,255,255,0.05)",
                  ],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: isHighlighted ? 4 : 0,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -left-8 top-0 w-[250px] h-full">
              <div
                className="w-full h-full bg-gradient-to-r"
                style={{
                  background: `linear-gradient(90deg, rgba(${color},0.2) 0%, rgba(${color},0.05) 60%, transparent 100%)`,
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="font-medium text-xs"
              style={{ color: `rgba(${color}, 0.9)` }}
            >
              Shard {shard.id}
            </span>
          </div>
          <span
            className="font-medium text-xs"
            style={{ color: `rgb(${color})` }}
          >
            {ping}ms
          </span>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <Popover placement="top" shouldCloseOnBlur triggerScaleOnOpen={false}>
      <PopoverTrigger>
        <motion.div className="cursor-pointer group relative">
          <motion.div
            className="relative overflow-hidden w-full h-8 border border-white/5 px-3 py-1 flex items-center justify-between transition-all duration-200 group-hover:border-white/10 group-hover:bg-white/[0.01]"
            style={{
              borderRadius: "10px",
              background: "transparent",
            }}
            animate={
              isHighlighted
                ? {
                    boxShadow: [
                      "0 0 0 0px rgba(255,255,255,0.0)",
                      "0 0 0 2px rgba(255,255,255,0.2), 0 0 8px rgba(255,255,255,0.1)",
                      "0 0 0 0px rgba(255,255,255,0.0)",
                    ],
                    borderColor: [
                      "rgba(255,255,255,0.05)",
                      "rgba(255,255,255,0.4)",
                      "rgba(255,255,255,0.05)",
                    ],
                  }
                : {}
            }
            transition={{
              duration: 1.5,
              repeat: isHighlighted ? 4 : 0,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -left-8 top-0 w-[250px] h-full">
                <div
                  className="w-full h-full bg-gradient-to-r"
                  style={{
                    background: `linear-gradient(90deg, rgba(${color},0.2) 0%, rgba(${color},0.05) 60%, transparent 100%)`,
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="font-medium text-xs"
                style={{ color: `rgba(${color}, 0.9)` }}
              >
                Shard {shard.id}
              </span>
              {hasDetailedData && (
                <span className="text-white/50 text-[10px] hidden sm:inline">
                  {shard.guilds.toLocaleString()} guilds •{" "}
                  {Math.round(shard.users / 1000)}k
                </span>
              )}
            </div>
            <span
              className="font-medium text-xs"
              style={{ color: `rgb(${color})` }}
            >
              {ping}ms
            </span>
          </motion.div>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="hidden sm:block bg-[#0A0B0B]/95 backdrop-blur-sm border border-white/10 p-0 rounded-lg shadow-lg select-none">
        <div className="px-3 py-2">
          <div className="flex items-center text-xs font-medium whitespace-nowrap">
            <span className="text-white/90">
              {shard.guilds.toLocaleString()}
            </span>
            <span className="text-white/40 ml-1">guilds</span>
            <span className="text-white/30 mx-2">•</span>
            <span className="text-white/90">
              {shard.users.toLocaleString()}
            </span>
            <span className="text-white/40 ml-1">users</span>
            <span className="text-white/30 mx-2">•</span>
            <span className="text-white/60">up for</span>
            <span className="text-white/90 ml-1">
              {formatUptime(shard.uptime)}
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
