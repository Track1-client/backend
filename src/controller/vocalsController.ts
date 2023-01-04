import { Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { vocalsService } from '../service';


const getAllVocals = async(req: Request, res: Response) => {

    const data = await vocalsService.getVocals();



};

const vocalsController = {
    getAllVocals,
};

export default vocalsController;