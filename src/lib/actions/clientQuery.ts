import { rpcCall } from "./client";
import { Operations, QueryPayload, QueryResponsePayload } from "./types";

function obfuscate(data: any): string {
    return btoa(JSON.stringify(data));
}

function deobfuscate(data: string): any {
    return JSON.parse(atob(data));
}

export async function query(operation: Operations, params?: Record<string, any>): Promise<any> {
    const id = Math.random().toString(36).substr(2, 12);

    const queries = [{
        id,
        op: btoa(operation),
        p: btoa(JSON.stringify(params || {}))
    }];

    const payload: QueryPayload = {
        q: queries,
        b: Math.random().toString(36).substr(2, 9),
        t: Date.now(),
        v: process.env.build || 'dev build'
    };

    const encodedPayload = obfuscate(payload);

    const response = await rpcCall(encodedPayload);
    const decoded: QueryResponsePayload = deobfuscate(response);

    if (decoded.e) throw new Error(decoded.e);

    const results = decoded.r;
    const result = results.find((r) => r.id === id);

    if (!result) throw new Error("Query result not found");

    if (result.error) throw new Error(result.error);

    return result.data;
}