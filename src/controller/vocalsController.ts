import { Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import convertCategory from '../modules/convertCategory';
import { vocalsService } from '../service';


const getFilteringVocals = async(req: Request, res: Response) => {

    const { categ, isSelected, page, limit } = req.query;
    
    const data = await vocalsService.getFilteredVocals(await convertCategory(categ), isSelected as string, Number(page), Number(limit));
    if(!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.GET_VOCAL_LIST_FAIL)); 
    
    return res.status(sc.OK).send(success(sc.OK, rm.GET_VOCAL_LIST_SUCCESS, {"vocalList": data}));

};

const vocalsController = {
    getFilteringVocals,
};

export default vocalsController;