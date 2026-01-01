import { HttpClient } from '../httpClient';

export interface AvatarHistoryItem {
    avatar_url: string;
    timestamp: string;
}

export class AvatarsApi {
    constructor(private client: HttpClient) { }

    async fetchHistory(userId: string): Promise<AvatarHistoryItem[]> {
        try {
            const response = await this.client.post<{ avatars: AvatarHistoryItem[] }>('/avatars', { user_id: userId });
            return response.data.avatars || [];
        } catch (error) {
            return [];
        }
    }
}