export interface QueryRequest {
    id: string;
    operation: string;
    params?: Record<string, any>;
}

export interface QueryResponse<T = any> {
    id: string;
    data?: T;
    error?: string;
}

export interface BatchQueryRequest {
    queries: QueryRequest[];
}

export interface BatchQueryResponse {
    results: QueryResponse[];
}

export type OperationHandler<T = any> = (params?: Record<string, any>) => Promise<T>;

export interface OperationRegistry {
    [key: string]: OperationHandler;
}

export enum Operations {
    STATUS_FETCH = "status.fetch",
    COMMANDS_FETCH = "commands.fetch",
    USER_FIND = "user.find",
    USER_AVATAR_HISTORY = "user.avatarHistory",
    GUILD_FIND = "guild.find",
    POW_GENERATE = "pow.generate",
    POW_VALIDATE = "pow.validate"
}

export interface EncodedQuery {
    id: string;
    op: string; // base64
    p: string; // base64
}

export interface QueryPayload {
    q: EncodedQuery[];
    b: string;
    t: number;
    v: string;
}

export interface QueryResponseItem {
    id: string;
    data?: any;
    error?: string;
}

export interface QueryResponsePayload {
    r: QueryResponseItem[];
    e?: string;
}