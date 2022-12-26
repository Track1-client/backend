import { NextFunction, Request, Response } from "express";
import { sc } from '../../constants';
import { fail } from '../../constants/response';
import  { body, validationResult } from 'express-validator';


export default async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const message = errors.array()

    if (!errors.isEmpty()) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, message.toString()));
    next();
}