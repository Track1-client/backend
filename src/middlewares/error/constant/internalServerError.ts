import { AbstractError } from '../abstractError';

export class InternalServerError extends AbstractError {
    constructor(...args: any) {
        super(...args);
        this.code = '999';
        this.name = 'InternalServerError';
        this.stack = `${this.message}\n${new Error().stack}`;
        this.statusCode = 500;
    };
};