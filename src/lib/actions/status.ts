"use server";

import { queryEngine } from "./engine";

export interface BotStatus {
    users: number;
    shards: { [key: string]: number };
    status?: string;
    total?: {
        users: number;
        guilds: number;
    };
}

async function fetchStatus(): Promise<BotStatus> {
    try {
        const [statusResponse, shardsResponse] = await Promise.all([
            fetch("https://s.vain.bot/status", {}),
            fetch("https://s.vain.bot/shards", {})
        ]);

        if (!statusResponse.ok || !shardsResponse.ok) {
            throw new Error("Failed to fetch status or shards");
        }

        const [statusData, shardsData] = await Promise.all([
            statusResponse.json(),
            shardsResponse.json()
        ]);

        return {
            users: statusData.members,
            shards: shardsData.shards || {},
            total: {
                users: statusData.members,
                guilds: statusData.guilds,
            },
        };
    } catch (error) {
        console.error("Error fetching status:", error);
        return {
            status: "offline",
            users: 0,
            shards: {},
            total: {
                users: 0,
                guilds: 0,
            },
        };
    }
}

queryEngine.register("status.fetch", fetchStatus);