import { AbstractError } from '../abstractError';

export class NoPortfolioData extends AbstractError {
    constructor(...args: any) {
        super(...args);
        this.code = '1001';
        this.name = 'NoPortfolioData';
        this.stack = `${this.message}\n${new Error().stack}`;
        this.statusCode = 400;
    }
};