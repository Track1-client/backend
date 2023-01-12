import { AbstractError } from '../abstractError';

export class NoSoundFile extends AbstractError {
    constructor(...args: any) {
        super(...args);
        this.code = '1006';
        this.name = 'NoSoundFile';
        this.stack = `${this.message}\n${new Error().stack}`;
        this.statusCode = 400;
    };
};