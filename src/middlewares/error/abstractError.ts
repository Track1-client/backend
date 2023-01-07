export abstract class AbstractError extends Error {
    public code: string | undefined;
    public statusCode: number | undefined;
    constructor(...args: any) {
        super(...args);
    };
};