import { Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { getAudioDurationInSeconds } from 'get-audio-duration';


const getOneBeat = async(req: Request, res: Response) => {

    const { tableName, userId, beatId } = req.body;    //! auth 미들웨어를 통해 토큰 검사 후 userId 받아옴.



}


const tracksController = {
    getOneBeat,
};

export default tracksController;