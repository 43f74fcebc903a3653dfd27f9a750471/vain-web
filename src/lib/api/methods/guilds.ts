import { HttpClient } from '../httpClient';

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

export class GuildsApi {
    constructor(private client: HttpClient) { }

    async fetch(guildId: string): Promise<GuildData | null> {
        try {
            const response = await this.client.get<GuildData>(`/guilds/${guildId}`);
            return response.data;
        } catch (error) {
            return null;
        }
    }
}