import { AbstractError } from '../abstractError';

export class InvalidUpdateVocalIdError extends AbstractError {
    constructor(...args: any) {
        super(...args);
        this.code = '1001';
        this.name = 'InvalidUpdateVocalIdError';
        this.stack = `${this.message}\n${new Error().stack}`;
        this.statusCode = 400;
    };
};