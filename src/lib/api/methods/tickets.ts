import { TicketResponse } from '@/types/tickets';
import { HttpClient } from '../httpClient';

export class TicketsApi {
    constructor(private client: HttpClient) { }

    async fetch(id: string): Promise<TicketResponse | null> {
        try {
            const response = await this.client.post<TicketResponse>('/tickets', { id });
            return response.data;
        } catch (error) {
            return null;
        }
    }
}