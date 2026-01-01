import { HttpClient } from './httpClient';
import { CommandsApi } from './methods/commands';
import { StatusApi } from './methods/status';
import { AvatarsApi } from './methods/avatars';
import { UserApi } from './methods/user';
import { TicketsApi } from './methods/tickets';
import { GuildsApi } from './methods/guilds';

export class ApiClient {
    private readonly mainClient: HttpClient;

    constructor() {
        this.mainClient = new HttpClient({
            baseURL: 'https://s.vain.bot',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    public get commands(): CommandsApi {
        return new CommandsApi(this.mainClient);
    }

    public get status(): StatusApi {
        return new StatusApi(this.mainClient);
    }

    public get avatars(): AvatarsApi {
        return new AvatarsApi(this.mainClient);
    }

    public get user(): UserApi {
        return new UserApi(this.mainClient);
    }

    public get tickets(): TicketsApi {
        return new TicketsApi(this.mainClient);
    }

    public get guilds(): GuildsApi {
        return new GuildsApi(this.mainClient);
    }
}

export const apiClient = new ApiClient();