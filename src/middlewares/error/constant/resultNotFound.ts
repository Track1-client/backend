import { AbstractError } from '../abstractError';

export class ResultNotFound extends AbstractError {
    constructor(...args: any) {
        super(...args);
        this.code = '1002';
        this.name = 'ResultNotFoundError';
        this.stack = `${this.message}\n${new Error().stack}`;
        this.statusCode = 500;
    }
};