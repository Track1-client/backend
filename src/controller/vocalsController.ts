import { ResultNotFound } from './../middlewares/error/constant/resultNotFound';
import { NextFunction, Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import convertCategory from '../modules/convertCategory';
import { vocalsService } from '../service';


const getFilteringVocals = async(req: Request, res: Response, next: NextFunction) => {

    try {
        const { categ, isSelected, page, limit } = req.query;
        
        const data = await vocalsService.getFilteredVocals(await convertCategory(categ), isSelected as string, Number(page), Number(limit));
        if(!data) throw new ResultNotFound(rm.GET_VOCAL_LIST_FAIL);
        
        return res.status(sc.OK).send(success(sc.OK, rm.GET_VOCAL_LIST_SUCCESS, {"vocalList": data}));
    } catch(error) {
        return next(error);
    };
};

const vocalsController = {
    getFilteringVocals,
};

export default vocalsController;