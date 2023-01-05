import { Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { profileService } from "../service";

const getProducerProfile= async(req:Request, res:Response) => {

    const { producerId } = req.params;
    const { userId, tableName } = req.body;

    const data = await profileService.getProducerProfileData(+producerId,+userId, tableName);
    if(!data) return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INVALID_BEAT_ID));

    return res.status(sc.OK).send(success(sc.OK, rm.READ_ALL_COMMENT_SUCCESS, {"commentList": data}));
}

const profileController = {
    getProducerProfile,
};

export default profileController;