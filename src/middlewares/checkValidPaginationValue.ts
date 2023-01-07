import { NextFunction, Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail } from '../constants/response';
import { PaginationDTO } from '../interfaces';

//~ 무한스크롤을 위한 페이지네이션 변수 조건 확인
export default async (req: Request, res: Response, next: NextFunction) => {
    
    const paginationDTO: PaginationDTO = req.query as any;

    console.log(paginationDTO.page);
    let numPage = Number(paginationDTO.page);
    let numLimit = Number(paginationDTO.limit);
    
    const pageCondition = ( numPage>=1 && Number.isInteger(numPage) );
    const limitCondition = ( numLimit>=1 && Number.isInteger(numLimit) );

    const result = ( pageCondition && limitCondition ) ? true : false;
    if(!result) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_PAGINATION_QUERY_PARAMS));
    
    next();
};