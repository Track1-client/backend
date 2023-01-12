import { AbstractError } from '../abstractError';

export class InvalidUpdatePortfolioIdError extends AbstractError {
    constructor(...args: any) {
        super(...args);
        this.code = '1001';
        this.name = 'InvalidUpdatePortfolioIdError';
        this.stack = `${this.message}\n${new Error().stack}`;
        this.statusCode = 400;
    };
};