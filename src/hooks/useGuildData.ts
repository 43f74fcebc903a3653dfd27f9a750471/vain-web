import { useQuery } from "@tanstack/react-query";
import { GuildData, query, Operations } from "@/lib/actions/index";
import { solvePow } from "@/lib/pow";

interface UseGuildDataResult {
    guild: GuildData | null;
    isLoading: boolean;
    error: Error | null;
}

async function fetchGuildData(guildId: string) {
    const challenge = await query(Operations.POW_GENERATE);
    const powResult = await solvePow(challenge);

    if (!powResult.s || !powResult.sol) throw new Error("Failed to solve POW");

    return query(Operations.GUILD_FIND, { guildId, pow: powResult.sol });
}

export const useGuildData = (guildId: string): UseGuildDataResult => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["guild-data", guildId],
        queryFn: () => fetchGuildData(guildId),
        enabled: !!guildId && /^\d+$/.test(guildId),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        guild: data || null,
        isLoading,
        error: error as Error | null,
    };
};