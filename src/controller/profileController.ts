import { NextFunction, Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { profileService } from "../service";

const getProducerProfile = async(req: Request, res: Response, next: NextFunction) => {

    try {
        const { producerId } = req.params;
        const { userId, tableName } = req.body;
        const { page, limit } = req.query;

        const data = await profileService.getProducerProfileData(+producerId,+userId, tableName, Number(page), Number(limit));

        return res.status(sc.OK).send(success(sc.OK, rm.READ_PRODUCER_PROFILE_SUCCESS, data));

    } catch(error) {
        return next(error);
    };
};

const getOpenedBeats = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, tableName } = req.body;
        const { producerId } = req.params;
        const { page, limit } = req.query;

        const data = await profileService.getOpenedBeatsList(+producerId, Number(page), Number(limit));

        return res.status(sc.OK).send(success(sc.OK, rm.READ_SROTED_BEAT_SUCCESS, {"beatList": data}));

    } catch(error) {
        return next(error);
    };
};

const getVocalProfile = async(req:Request, res:Response, next: NextFunction) => {
    try {

        const { vocalId } = req.params;
        const { userId, tableName } = req.body;
        const { page, limit } = req.query;
        
        const data = await profileService.getVocalProfileData(+vocalId,+userId, tableName, Number(page), Number(limit));

        return res.status(sc.OK).send(success(sc.OK, rm.READ_VOCAL_PROFILE_SUCCESS, data));

    } catch(error) {
        return next(error);
    };
}

const profileController = {
    getProducerProfile,
    getOpenedBeats,
    getVocalProfile,
};

export default profileController;