import { Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { profileService } from "../service";

const getProducerProfile = async(req: Request, res: Response) => {

    const { producerId } = req.params;
    const { userId, tableName } = req.body;

    const data = await profileService.getProducerProfileData(+producerId,+userId, tableName);
    if(!data) return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));

    return res.status(sc.OK).send(success(sc.OK, rm.READ_ALL_COMMENT_SUCCESS, {"commentList": data}));
};

const getOpenedBeats = async(req: Request, res: Response) => {
    
    const { userId, tableName } = req.body;
    const { producerId } = req.params;

    const data = await profileService.getOpenedBeatsList(+producerId);
    if(!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_PRODUCER_ID));

    return res.status(sc.OK).send(success(sc.OK, rm.READ_SROTED_BEAT_SUCCESS, {"beatList": data}));
};

const profileController = {
    getProducerProfile,
    getOpenedBeats,
};

export default profileController;