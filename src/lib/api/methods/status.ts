import { HttpClient } from '../httpClient';

export interface BotStatus {
    users: number;
    shards: { [key: string]: number };
    status?: string;
    total?: {
        users: number;
        guilds: number;
    };
}

export class StatusApi {
    constructor(private client: HttpClient) { }

    async fetch(): Promise<BotStatus> {
        try {
            const [statusResponse, shardsResponse] = await Promise.all([
                this.client.get('/status'),
                this.client.get('/shards')
            ]);
            return {
                users: statusResponse.data.members,
                shards: shardsResponse.data.shards || {},
                total: {
                    users: statusResponse.data.members,
                    guilds: statusResponse.data.guilds,
                },
            };
        } catch (error) {
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
}