import { Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import config from '../config';
import { BeatCreateDTO } from '../interfaces/tracks';
import { tracksService } from '../service';
import convertCategory from '../modules/convertCategory';


const createBeat = async(req: Request, res: Response) => {

    const myfiles = JSON.parse(JSON.stringify(req.files));

    //* 재킷이미지 없는 경우 -> default jacketImage로 설정
    const jacketImageLocation = !("jacketImage" in myfiles) ? config.defaultBeatJacketImage : myfiles['jacketImage'][0]['location'] as string;

    //* wavFile 없는 경우 -> 오류 반환
    if(!("wavFile" in myfiles)) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_WAV_FILE));
    const wavFilelocation = myfiles['wavFile'][0]['location'] as string;

    const beatDTO: BeatCreateDTO = req.body;
    if (beatDTO.tableName !== 'producer') return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.ONLY_PRODUCER_CREATE)); //! 프로듀서만 글 작성 가능 

    beatDTO.category = convertCategory(beatDTO.category);

    const data = await tracksService.createBeat(beatDTO, jacketImageLocation as string, wavFilelocation as string);
    if (!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BEAT_UPLOAD_FAIL));

    return res.status(sc.CREATED).send(success(sc.CREATED, rm.IMAGE_UPLOAD_SUCCESS, {"beatId": data.id}));

}

const getOneBeat = async(req: Request, res: Response) => {

    const { tableName, userId, beatId } = req.body;    //! auth 미들웨어를 통해 토큰 검사 후 userId 받아옴.
    


}

const updateBeatClosed = async(req: Request, res: Response) => {

    const { beatId } = req.params;
    
    if(!beatId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));

    const updatedBeatClosed = await tracksService.updateBeatClosed(+beatId);
    return res.status(sc.OK).send(success(sc.OK, rm.BEAT_CLOSED))
}

const tracksController = {
    createBeat,
    getOneBeat,
    updateBeatClosed,
};

export default tracksController;