import { NextFunction, Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail } from '../constants/response';

//~ 무한스크롤을 위한 페이지네이션 변수 조건 확인
export default async (req: Request, res: Response, next: NextFunction) => {
    
    const { page, limit } = req.query;
    
    let numPage = Number(page);
    let numLimit = Number(limit);
    
    const pageCondition = ( numPage>=1 && Number.isInteger(numPage) );
    const limitCondition = ( numLimit>=1 && Number.isInteger(numLimit) );

    const result = ( pageCondition && limitCondition ) ? true : false;
    if(!result) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_PAGINATION_QUERY_PARAMS));
    
    next();
};