import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { constant } from 'lodash';
import config from '../../config';
import { rm, sc } from '../../constants';
import { fail } from '../../constants/response';
import slackAlarm, { SlackMessageFormat } from '../slackAlarm';
import { AbstractError } from './abstractError';

const globalErrorHandler: ErrorRequestHandler = (
    err: any, 
    req: Request, 
    res: Response, 
    next: NextFunction
): void |  Response => {
    //! 예상 가능한 에러 
    if (err instanceof AbstractError) { 
        const { message, statusCode, code } = err;
        console.error(err);
        
        if (!statusCode || statusCode == 500) {
            // 500 에러 발생 시 슬랙 알림 울리도록 추가
            const message: SlackMessageFormat = {
            color: slackAlarm.colors.danger,
            title: 'Track-1 서버 에러',
            text: err.message,
            fields: [
                {
                title: 'Error Stack:',
                value: `\`\`\`${err.stack}\`\`\``
                }
            ]
            };
            slackAlarm.sendMessage(message);
            console.error(`[statusCode: ${err.statusCode}] message: ${err.message}`);
        };

        res.status(statusCode || 500).json({ message, code });
    } 
    else {  //! 예상 불가능한 에러 
        console.error('[UNEXPECTED ERROR]: ' + err);
        return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    };
};

export default globalErrorHandler;