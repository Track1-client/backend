import { AbstractError } from '../abstractError';

export class VocalAndCommentDoesNotMatch extends AbstractError {
    constructor(...args: any) {
        super(...args);
        this.code = '1001';
        this.name = 'VocalAndCommentDoesNotMatch';
        this.stack = `${this.message}\n${new Error().stack}`;
        this.statusCode = 400;
    };
};