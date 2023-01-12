import { AbstractError } from '../abstractError';

export class InvalidBeatIdError extends AbstractError {
    constructor(...args: any) {
        super(...args);
        this.code = '1001';
        this.name = 'InvalidBeatIdError';
        this.stack = `${this.message}\n${new Error().stack}`;
        this.statusCode = 400;
    };
};