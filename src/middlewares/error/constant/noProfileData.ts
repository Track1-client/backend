import { AbstractError } from '../abstractError';

export class NoProfileData extends AbstractError {
    constructor(...args: any) {
        super(...args);
        this.code = '1005';
        this.name = 'NoPorfileData';
        this.stack = `${this.message}\n${new Error().stack}`;
        this.statusCode = 400;
    }
};