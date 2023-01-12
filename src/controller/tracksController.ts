import { NextFunction, Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import config from '../config';
import { BeatCreateDTO, BeatDownloadReturnDTO, CommentCreateDTO } from '../interfaces/tracks';
import { tracksService } from '../service';
import convertCategory from '../modules/convertCategory';
import { NoSoundFile } from '../middlewares/error/constant';


const createBeat = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const myfiles = JSON.parse(JSON.stringify(req.files));

        //* 재킷이미지 없는 경우 -> default jacketImage로 설정
        const jacketImageLocation = !("jacketImage" in myfiles) ? config.defaultBeatJacketImage : myfiles['jacketImage'][0]['location'] as string;

        //* wavFile 없는 경우 -> 오류 반환
        if(!("wavFile" in myfiles)) throw new NoSoundFile(rm.NO_WAV_FILE);
        const wavFilelocation = myfiles['wavFile'][0]['location'] as string;

        const beatDTO: BeatCreateDTO = req.body;
        if (beatDTO.tableName !== 'producer') return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.ONLY_PRODUCER_CREATE)); //! 프로듀서만 글 작성 가능 

        beatDTO.category = await beatDTO.category;

        const data = await tracksService.createBeat(beatDTO, jacketImageLocation as string, wavFilelocation as string);

        return res.status(sc.CREATED).send(success(sc.CREATED, rm.BEAT_UPLOAD_SUCCESS, {"beatId": data.id}));
    } catch (error) {
        return next(error);
    }
};


const getAllBeat = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { page, limit } = req.query;  //! for pagination - infinite scroll
        
        const data = await tracksService.getAllBeat(Number(page), Number(limit));

        return res.status(sc.OK).send(success(sc.OK, rm.READ_ALL_BEAT_SUCCESS, {"trackList": data})); 
    } catch (error) {
        return next(error);
    }
};

const getAllComment = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const { beatId } = req.params;
        const { userId, tableName } = req.body;
        const { page, limit } = req.query;

        const data = await tracksService.getAllComment(+beatId,+userId, tableName, Number(page), Number(limit));

        return res.status(sc.OK).send(success(sc.OK, rm.READ_ALL_COMMENT_SUCCESS, {"commentList": data})); 
    } catch (error) {
        return next(error);
    }
};


const getBeatFile = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { beatId } = req.params;

        const beatObject = await tracksService.getBeatLocation(+beatId);  //* beat url 가져오기

        const fileId = beatObject?.id;
        const beatFileLength = await getAudioDurationInSeconds(beatObject.beatFile);
        
        const beatReturnDTO: BeatDownloadReturnDTO = {
            beatId: fileId,
            wavFile: beatObject.beatFile,
            wavFileLength: beatFileLength
        }
        return res.status(sc.OK).send(success(sc.OK, rm.GET_FILE_SUCCESS, beatReturnDTO));
    } 
    catch(error) {
        return next(error);
    };
};


const updateBeatClosed = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const { beatId } = req.params;
        
        if(!beatId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_BEAT_ID));

        const updatedBeatClosed = await tracksService.updateBeatClosed(+beatId);
        return res.status(sc.OK).send(success(sc.OK, rm.BEAT_CLOSED));
    } catch (error) {
        return next(error);
    }
};

const getClickedBeat = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const { userId, tableName } = req.body;
        const { beatId } = req.params;

        const data = await tracksService.getClickedBeat(+beatId, +userId, tableName);

        return res.status(sc.OK).send(success(sc.OK, rm.GET_CLICKED_BEAT_SUCCESS, data)); 
    } catch (error) {
        return next(error);
    }
};

const postBeatComment = async(req:Request, res:Response, next: NextFunction) => {
    try {

        const { beatId } = req.params;
        
        const myfiles: Express.MulterS3.File = req.file as Express.MulterS3.File;
        const { location } = myfiles;
        //* wavFile 없는 경우 -> 오류 반환
        if(!myfiles) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_WAV_FILE));

        const commentCreateDTO: CommentCreateDTO = req.body;
        if (commentCreateDTO.tableName !== 'vocal') return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.ONLY_VOCAL_CREATE)); //! 보컬만 댓글 작성 가능 

        const data = await tracksService.postBeatComment(+beatId, commentCreateDTO, location as string);

        return res.status(sc.CREATED).send(success(sc.CREATED, rm.COMMENT_UPLOAD_SUCCESS, {"commentId": data.id}));
    } catch (error) {
        return next(error);
    }
};

const getFilteringTracks = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const { categ, page, limit } = req.query;

        const data = await tracksService.getFilteredTracks(await convertCategory(categ), Number(page), Number(limit));

        return res.status(sc.OK).send(success(sc.OK, rm.GET_FILTERING_SUCCESS, {"trackList": data}));
    } catch(error) {
        return next(error);
    }
};


const tracksController = {
    createBeat,
    getAllBeat,
    getBeatFile,
    updateBeatClosed,
    getClickedBeat,
    postBeatComment,
    getAllComment,
    getFilteringTracks,
};

export default tracksController;