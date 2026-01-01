import { useQuery } from "@tanstack/react-query";
import { query, Operations } from "@/lib/actions/index";
import { Command } from "@/types/commands";
import { processCommands } from "@/lib/commandUtils";

async function fetchStatusData() {
    return query(Operations.STATUS_FETCH);
}

export const useStatusQuery = () =>
    useQuery({
        queryKey: ["botStatus"],
        queryFn: fetchStatusData,
        staleTime: 30 * 1000,
        refetchInterval: 60 * 1000,
    });

const createSearchIndex = (commands: Command[]) => {
    const index = new Map<string, { command: Command; category: string; searchText: string }>();
    const flat: Command[] = [];

    for (const cmd of commands) {
        const category = cmd.cog || 'Uncategorized';
        const searchText = `${cmd.name} ${cmd.description || ''} ${cmd.qualified_name || ''} ${cmd.aliases?.join(' ') || ''} ${cmd.usage || ''} ${cmd.example || ''}`.toLowerCase();
        const key = `${category}:${cmd.qualified_name || cmd.name}`;

        index.set(key, { command: cmd, category, searchText });
        flat.push(cmd);
    }

    return { index, flat };
};

async function fetchCommandsData() {
    const data = await query(Operations.COMMANDS_FETCH);
    const filteredCommands = data.commands.filter((cmd: Command) =>
        cmd.enabled &&
        !cmd.hidden &&
        cmd.cog &&
        !['Developer', 'Jishaku'].includes(cmd.cog)
    );

    const cogCounts = new Map<string, number>();
    for (const cmd of filteredCommands) {
        const cog = cmd.cog || 'Uncategorized';
        cogCounts.set(cog, (cogCounts.get(cog) || 0) + 1);
    }

    const categoryData = Array.from(cogCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const processed = processCommands(filteredCommands as Command[]);
    const { index, flat } = createSearchIndex(processed);

    return {
        commands: processed,
        searchIndex: index,
        allCommands: flat,
        categories: categoryData.map(c => c.name),
        categoryData,
        totalCommands: filteredCommands.length,
        cogs: data.cogs,
    };
}

export const useCommandsQuery = () =>
    useQuery({
        queryKey: ["commands"],
        queryFn: fetchCommandsData,
        staleTime: 10 * 60 * 1000,
    });

async function fetchUserData(userId: string) {
    return query(Operations.USER_FIND, { userId });
}

export const useUserQuery = (userId: string) =>
    useQuery({
        queryKey: ["user", userId],
        queryFn: () => fetchUserData(userId),
        staleTime: 15 * 60 * 1000,
        enabled: !!userId,
    });