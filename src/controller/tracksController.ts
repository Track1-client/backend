import { Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import config from '../config';
import { BeatCreateDTO, BeatDownloadReturnDTO } from '../interfaces/tracks';
import { tracksService } from '../service';
import convertCategory from '../modules/convertCategory';
import downloadBeatFile from '../modules/downloadBeatFile';
const fs = require('fs')



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
};


const getAllBeat = async (req: Request, res: Response) => {

    const data = await tracksService.getAllBeat();
    if(!data) return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));

    return res.status(sc.OK).send(success(sc.OK, rm.READ_ALL_BEAT_SUCCESS, {"trackList": data})); 
};

const getBeatFile = async(req: Request, res: Response) => {

    try {
        const { beatId } = req.params;

        const beatObject = await tracksService.getBeatLocation(+beatId);  //* beat url 가져오기
        if(!beatObject) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_FILE_ID));

        const fileId = beatObject?.id;
        //const beatFile = await downloadBeatFile(beatObject?.beatFile, config.bothWavImageBucketName);
        
        const beatFileLength = await getAudioDurationInSeconds(beatObject.beatFile);
        
        const beatReturnDTO: BeatDownloadReturnDTO = {
            beatId: fileId,
            wavFile: beatObject.beatFile,
            wavFileLength: beatFileLength
        }
        return res.status(sc.OK).send(success(sc.OK, rm.GET_FILE_SUCCESS, beatReturnDTO));
    } 
    catch(error) {
        console.error(error);
        return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    };
};


const updateBeatClosed = async(req: Request, res: Response) => {

    const { beatId } = req.params;
    
    if(!beatId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_BEAT_ID));

    const updatedBeatClosed = await tracksService.updateBeatClosed(+beatId);
    return res.status(sc.OK).send(success(sc.OK, rm.BEAT_CLOSED))
}

const getClickedBeat = async(req:Request, res:Response) => {
    const { userId, tableName } = req.body;
    const { beatId } = req.params;

    const data = await tracksService.getClickedBeat(+beatId, +userId, tableName);
    if(!data) return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
     
    return res.status(sc.OK).send(success(sc.OK, rm.GET_CLICKED_BEAT_SUCCESS, data)); 
}

const tracksController = {
    createBeat,
    getAllBeat,
    getBeatFile,
    updateBeatClosed,
    getClickedBeat,
};

export default tracksController;