import { AbstractError } from '../abstractError';

export class UserDoesNotExists extends AbstractError {
    constructor(...args: any) {
        super(...args);
        this.code = '1000';
        this.name = 'UserDoesNotExists';
        this.stack = `${this.message}\n${new Error().stack}`;
        this.statusCode = 400;
    };
};