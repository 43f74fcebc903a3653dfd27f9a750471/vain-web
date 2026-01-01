import {
    OperationRegistry,
    QueryRequest,
    QueryResponse,
    BatchQueryRequest,
    BatchQueryResponse
} from "./types";

class QueryEngine {
    private operations: OperationRegistry = {};

    register(operation: string, handler: (params?: Record<string, any>) => Promise<any>) {
        this.operations[operation] = handler;
    }

    async execute<T>(operation: string, params?: Record<string, any>): Promise<T> {
        const handler = this.operations[operation];
        if (!handler) {
            throw new Error(`Operation '${operation}' not found`);
        }
        return handler(params);
    }

    async batch(requests: QueryRequest[]): Promise<QueryResponse[]> {
        const promises = requests.map(async (req) => {
            try {
                const data = await this.execute(req.operation, req.params);
                return { id: req.id, data };
            } catch (error) {
                return {
                    id: req.id,
                    error: error instanceof Error ? error.message : "Unknown error"
                };
            }
        });

        return Promise.all(promises);
    }
}

export const queryEngine = new QueryEngine();