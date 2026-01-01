"use server";

import { queryEngine } from "./engine";

export interface GuildData {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    banner: string | null;
    splash: string | null;
    discovery_splash: string | null;
    features: string[];
    member_count: number | null;
    max_members: number | null;
    premium_tier: number;
    premium_subscription_count: number | null;
    preferred_locale: string;
    nsfw_level: number;
    verification_level: number;
    explicit_content_filter: number;
    mfa_level: number;
    vanity_url_code: string | null;
    system_channel_flags: number;
    afk_timeout: number;
    afk_channel_id: string | null;
    owner_id: string;
    created_at: string;
}

async function findGuild(params?: Record<string, any>): Promise<GuildData | null> {
    if (!params?.guildId) throw new Error("guildId is required");
    if (!params?.pow) throw new Error("pow is required");

    const isValidPow = await queryEngine.execute<boolean>("pow.validate", { pow: params.pow });

    if (!isValidPow) throw new Error("Invalid POW solution");

    try {
        const response = await fetch(`https://s.vain.bot/guilds/${params.guildId}`, {
            next: { revalidate: 300 },
        });

        if (!response.ok) throw new Error("Failed to fetch guild");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error finding guild:", error);
        return null;
    }
}

queryEngine.register("guild.find", findGuild);