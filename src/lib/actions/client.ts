"use server";

import { queryEngine } from "./engine";
import { BatchQueryRequest, BatchQueryResponse } from "./types";
import "./user";
import "./guild";
import "./commands";
import "./status";
import "./pow";

function obfuscate(data: any): string {
    return Buffer.from(JSON.stringify(data)).toString('base64');
}

function deobfuscate(data: string): any {
    return JSON.parse(Buffer.from(data, 'base64').toString());
}

export async function executeQuery<T>(
    operation: string,
    params?: Record<string, any>
): Promise<T> {
    return queryEngine.execute<T>(operation, params);
}

export async function executeBatch(
    request: BatchQueryRequest
): Promise<BatchQueryResponse> {
    const results = await queryEngine.batch(request.queries);
    return { results };
}

export async function batchQuery(operations: Array<{ operation: string; params?: Record<string, any> }>) {
    const queries = operations.map(op => ({
        id: `${op.operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        operation: op.operation,
        params: op.params
    }));

    try {
        const results = await queryEngine.batch(queries);
        return results;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
}

export async function rpcCall(payload: string): Promise<string> {
    const decoded = deobfuscate(payload);
    const { q: queries } = decoded;

    try {
        const decodedQueries = queries.map((q: any) => ({
            id: q.id,
            operation: Buffer.from(q.op, 'base64').toString(),
            params: JSON.parse(Buffer.from(q.p, 'base64').toString())
        }));

        const results = await queryEngine.batch(decodedQueries);
        return obfuscate({ r: results });
    } catch (error) {
        return obfuscate({ e: error instanceof Error ? error.message : "Unknown error" });
    }
}

export async function getRegisteredOperations() {
    return Object.keys((queryEngine as any).operations);
}



