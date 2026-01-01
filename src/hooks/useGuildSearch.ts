import { useState, useEffect, useCallback } from "react";
import {
  fetchGuild,
  generatePowChallenge,
  type GuildData,
} from "@/lib/actions";
import { solvePow, type PowChallenge } from "@/lib/pow";

interface UseGuildSearchResult {
  guild: GuildData | null;
  loading: boolean;
  error: string | null;
}

export const useGuildSearch = (
  guildId: string,
  delay: number = 800
): UseGuildSearchResult => {
  const [guild, setGuild] = useState<GuildData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchGuild = useCallback(async (id: string) => {
    if (!id.trim() || !/^\d+$/.test(id.trim())) {
      setGuild(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const challenge = await generatePowChallenge();
      const powResult = await solvePow(challenge);

      if (!powResult.s || !powResult.sol) {
        setError("Failed to solve POW");
        setGuild(null);
        return;
      }

      const guildData = await fetchGuild(id.trim(), powResult.sol);
      setGuild(guildData);
      if (!guildData) {
        setError("Guild not found");
      }
    } catch (err) {
      console.error("Error in searchGuild:", err);
      setError("Failed to fetch guild");
      setGuild(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchGuild(guildId);
    }, delay);

    return () => clearTimeout(timer);
  }, [guildId, delay, searchGuild]);

  return { guild, loading, error };
};
