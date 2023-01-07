import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { rm, sc } from '../../constants';
import { fail } from '../../constants/response';
import { AbstractError } from './abstractError';

const globalErrorHandler: ErrorRequestHandler = (e: any, req: Request, res: Response, next: NextFunction) => {
    //! 예상 가능한 에러 
    console.log('aaaa');
    if (e instanceof AbstractError) { 
        const { message, statusCode, code } = e;
        console.error(e);
        res.status(statusCode || 500).json({ message, code });
    } else {  //! 예상 불가능한 에러 
        console.error('[UNEXPECTED ERROR]: ' + e);
        //* [TO_DO] Slack 이벤트 발생 등...
        return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    };
};

export default globalErrorHandler;