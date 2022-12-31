import { NextFunction, Request, Response } from "express";
import { sc } from '../../constants';
import { fail } from '../../constants/response';
import  { validationResult } from 'express-validator';


export default async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array();
    
    if(Object.keys(errors).length !== 0 ) {
        const messages = errors.map(e => String(e.param) + ':' + String(e.msg));
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, String(messages)));
    }

    next();
}