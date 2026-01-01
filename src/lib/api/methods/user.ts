import { HttpClient } from '../httpClient';

export interface UserData {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    bot: boolean;
    system: boolean;
}

export class UserApi {
    constructor(private client: HttpClient) { }

    async find(userId: string): Promise<UserData | null> {
        try {
            const response = await this.client.post<UserData>('/user/find', { user_id: userId });
            return response.data || null;
        } catch (error) {
            return null;
        }
    }
}