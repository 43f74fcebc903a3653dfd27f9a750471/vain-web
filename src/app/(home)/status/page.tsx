"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { type BotStatus } from "@/lib/actions";
import { useGuildData } from "@/hooks/useGuildData";
import { useOptimizedDebounce } from "@/hooks/useOptimizedDebounce";
import { useStatusQuery } from "@/hooks/useQueries";
import { Activity, AlertCircle, Search, Loader2 } from "lucide-react";
import { FaCubes, FaUserGroup } from "react-icons/fa6";
import { IoMdRefresh } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser } from "react-icons/fa";
import { StatusCard } from "@/components/status/StatusCard";
import { ShardPill } from "@/components/status/ShardPill";
import { PiPillFill } from "react-icons/pi";
import {
  StatusCardSkeleton,
  ShardPillSkeleton,
} from "@/components/status/SkeletonCard";
import { PageLayout } from "@/components/ui/PageLayout";
import { SiInstatus } from "react-icons/si";
import styles from "@/components/ui/css/mesh.module.css";

export default function StatusPage() {
  const { data: botStatus, isLoading, refetch, isFetching } = useStatusQuery();
  const [searchId, setSearchId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [highlightedShard, setHighlightedShard] = useState<number | null>(null);
  const [refreshDisabled, setRefreshDisabled] = useState(false);
  const [bannerLoaded, setBannerLoaded] = useState(false);

  const debouncedSearchId = useOptimizedDebounce(searchId, 800);

  const {
    guild,
    isLoading: guildLoading,
    error: guildError,
  } = useGuildData(debouncedSearchId);

  useEffect(() => {
    if (/^\d+$/.test(inputValue)) {
      setSearchId(inputValue);
    } else {
      setSearchId("");
    }
  }, [inputValue]);

  useEffect(() => {
    if (guild?.banner) {
      setBannerLoaded(false);
      setTimeout(() => setBannerLoaded(true), 100);
    }
  }, [guild?.banner]);

  const calculateShard = (guildId: string, totalShards: number) => {
    if (!guildId || totalShards === 0) return null;
    return Number((BigInt(guildId) >> BigInt(22)) % BigInt(totalShards));
  };

  const handleSearch = useCallback(() => {
    if (!botStatus) return;
    if (!inputValue.trim()) {
      setHighlightedShard(null);
      return;
    }

    const totalShards = Object.keys(botStatus.shards).length;
    const shardId = calculateShard(inputValue.trim(), totalShards);
    if (shardId !== null) {
      setHighlightedShard(Number(shardId));
      setTimeout(() => setHighlightedShard(null), 5000);
    }
  }, [botStatus, inputValue]);

  const showOnlineStatus = () => {
    if (!botStatus) return null;
    const totalShards = Object.keys(botStatus.shards).length;

    if (totalShards === 0) {
      return (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-md p-3 flex items-center">
          <AlertCircle className="w-4 h-4 text-amber-300 mr-3" />
          <p className="text-amber-300 text-sm">
            Partial system degradation detected
          </p>
        </div>
      );
    }

    return (
      <div className="relative overflow-hidden rounded-md bg-black/20 border border-white/[0.08] min-w-fit">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-8 top-0 w-[400px] h-full">
            <div className="w-full h-full bg-gradient-to-r from-vain-primary/20 via-vain-primary/5 to-transparent">
              <Activity className="w-32 h-32 text-vain-primary/25 transform -translate-y-1/4" />
            </div>
          </div>
        </div>
        <div className="relative px-2 py-1.5 flex items-center justify-between">
          <div className="flex items-center">
            <p className="text-vain-400 text-xs whitespace-nowrap">
              All systems operational
            </p>
          </div>
          <button
            onClick={() => {
              if (!refreshDisabled) {
                setRefreshDisabled(true);
                refetch();
                setTimeout(() => setRefreshDisabled(false), 2000);
              }
            }}
            disabled={isFetching || refreshDisabled}
            className={`px-1.5 py-1 text-xs rounded-md border border-white/[0.08] text-white/70 ml-3 transition-all duration-200 relative ${
              isFetching || refreshDisabled
                ? "bg-black/10 cursor-progress"
                : "bg-black/20 hover:border-white/20 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-1">
              <IoMdRefresh className={`w-3 h-3`} />
              Refresh
            </div>
          </button>
        </div>
      </div>
    );
  };

  return (
    <PageLayout
      title="Status"
      subtitle="Monitor the real-time status of vain and its clusters"
      icon={<SiInstatus className="w-6 h-6 text-vain-primary" />}
    >
      {isLoading ? (
        <>
          <div className="mb-2 flex flex-col sm:flex-row gap-2">
            <div className="relative overflow-hidden rounded-md bg-white/[0.01] border border-white/5 min-w-fit">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -left-8 top-0 w-[400px] h-full">
                  <div className="w-full h-full bg-gradient-to-r from-white/5 via-white/[0.01] to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="relative px-2 py-1.5 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-32 h-4 bg-white/10 rounded animate-pulse"></div>
                </div>
                <div className="w-16 h-6 bg-white/10 rounded animate-pulse ml-3"></div>
              </div>
            </div>
            <div className="bg-black/20 border border-white/[0.08] rounded-md flex-1">
              <div className="relative px-2 py-1.5 flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0">
                  <div className="w-48 h-4 bg-white/10 rounded animate-pulse"></div>
                </div>
                <div className="px-1.5 py-1 text-xs rounded-md border border-white/[0.08] bg-black/20 flex items-center gap-1">
                  <div className="w-3 h-3 bg-white/20 rounded animate-pulse"></div>
                  <div className="w-16 h-3 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {[...Array(4)].map((_, i) => (
              <StatusCardSkeleton key={i} />
            ))}
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="w-20 h-6 bg-white/10 rounded animate-pulse"></div>
              <div className="w-32 h-4 bg-white/10 rounded animate-pulse"></div>
            </div>
            <div className="bg-[#0A0B0B] border border-white/10 rounded-lg p-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...Array(12)].map((_, i) => (
                  <ShardPillSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : botStatus ? (
        <>
          <div className="mb-2 flex flex-col sm:flex-row gap-2">
            {showOnlineStatus()}
            <div className="bg-black/20 border border-white/[0.08] rounded-md flex-1">
              <div className="relative px-2 py-1.5 flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0">
                  <input
                    type="text"
                    placeholder="Enter server ID to find its shard..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                    className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-1.5 py-1 text-xs rounded-md border border-white/[0.08] text-white/70 bg-black/20 hover:border-white/20 hover:text-white flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 relative"
                >
                  <Search className="w-3 h-3" />
                  Find Shard
                </button>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {(guild || guildLoading) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="overflow-hidden border border-white/[0.08] rounded-md mt-2 mb-2 relative"
              >
                {guild?.banner && (
                  <>
                    <div
                      className={`${styles.banner} ${bannerLoaded ? styles.loaded : ""}`}
                      style={{
                        backgroundImage: `url(${guild.banner.replace(
                          "size=1024",
                          "size=512"
                        )})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50" />
                  </>
                )}
                <div className="relative bg-black/20 px-2 py-1.5">
                  <AnimatePresence mode="wait">
                    {guildLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 h-5"
                      >
                        <Loader2 className="w-4 h-4 text-vain-primary/60 animate-spin" />
                        <span className="text-white/60 text-xs">
                          Searching ...
                        </span>
                      </motion.div>
                    ) : guild ? (
                      <motion.div
                        key={guild.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 flex items-center justify-center rounded-md ${guild.banner ? "bg-black/50" : ""}`}
                          >
                            {guild.icon ? (
                              <img
                                src={guild.icon.replace("size=1024", "size=32")}
                                alt={guild.name}
                                decoding="async"
                                loading="eager"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://cdn.discordapp.com/embed/avatars/0.png";
                                }}
                                className="w-5 h-5 rounded-md object-cover"
                              />
                            ) : (
                              <FaUserGroup className="w-5 h-5 text-vain-primary/80" />
                            )}
                          </div>
                          <span className="text-white/90 text-xs font-medium">
                            {guild.name}
                          </span>
                        </div>
                        <span className="text-white/60 text-xs">
                          {guild.member_count
                            ? `${guild.member_count.toLocaleString()} members`
                            : "?"}{" "}
                          •{" "}
                          {guild.created_at
                            ? new Date(guild.created_at).toLocaleDateString()
                            : "Unknown"}
                        </span>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <StatusCard
              title="Users"
              value={botStatus.total?.users.toLocaleString() || 0}
              icon={<FaUser className="w-4 h-4 text-vain-primary/80" />}
            />
            <StatusCard
              title="Guilds"
              value={botStatus.total?.guilds.toLocaleString() || 0}
              icon={<FaUserGroup className="w-4 h-4 text-vain-primary/80" />}
            />
            <StatusCard
              title="Shards"
              value={Object.keys(botStatus.shards).length}
              icon={<PiPillFill className="w-4 h-4 text-vain-primary/80" />}
            />
            <StatusCard
              title="Average Latency"
              value={`${Math.round(((Object.values(botStatus.shards) as number[]).reduce((sum, latency) => sum + latency, 0) * 1000) / Object.values(botStatus.shards).length) || 0}ms`}
              icon={<FaCubes className="w-4 h-4 text-vain-primary/80" />}
            />
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Shards</h2>
              <span className="text-white/40 text-sm">
                Updated {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="bg-black/20 border border-white/[0.08] rounded-lg p-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(botStatus.shards).map(([shardId, latency]) => (
                  <ShardPill
                    key={shardId}
                    shard={{
                      id: parseInt(shardId),
                      latency: latency as number,
                      guilds: 0,
                      users: 0,
                      uptime: 0,
                    }}
                    isHighlighted={parseInt(shardId) === highlightedShard}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center py-20 border border-white/5 rounded-md bg-white/[0.01]">
          <div className="bg-vain-primary/10 p-4 rounded-full mb-4 border border-vain-primary/20">
            <AlertCircle className="w-8 h-8 text-vain-primary/70" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">
            Unable to fetch status
          </h2>
          <p className="text-white/60 text-center max-w-md mb-4 text-sm">
            We're currently unable to retrieve the bot status information. This
            could be due to maintenance or connection issues.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-black/20 hover:bg-black/30 border border-white/[0.08] hover:border-white/20 rounded-md text-white/70 hover:text-white font-medium flex items-center gap-2 transition-all duration-200 relative"
          >
            <AlertCircle className="w-4 h-4" />
            Retry Connection
          </button>
        </div>
      )}
    </PageLayout>
  );
}
