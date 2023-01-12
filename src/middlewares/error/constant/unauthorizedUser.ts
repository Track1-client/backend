import { AbstractError } from '../abstractError';

export class UnauthorizedUser extends AbstractError {
    constructor(...args: any) {
        super(...args);
        this.code = '1000';
        this.name = 'UnauthorizedUser';
        this.stack = `${this.message}\n${new Error().stack}`;
        this.statusCode = 401;
    };
};