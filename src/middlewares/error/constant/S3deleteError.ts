import { AbstractError } from '../abstractError';

export class S3DeleteError extends AbstractError {
    constructor(...args: any) {
        super(...args);
        this.code = '1005';
        this.name = 'S3DeleteError';
        this.stack = `${this.message}\n${new Error().stack}`;
        this.statusCode = 500;
    }
};