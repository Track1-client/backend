import { Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import config from '../config';
import { ProducerPortfolioDTO, VocalPortfolioDTO } from '../interfaces/mypage';
import convertCategory from '../modules/convertCategory';
import { mypageService, profileService } from '../service';
import slackAlarm, { SlackMessageFormat } from "../middlewares/slackAlarm";

const createProducerPortfolio = async(req: Request, res: Response) => {
    const myfiles = JSON.parse(JSON.stringify(req.files));

    //* 재킷이미지 없는 경우 -> default jacketImage로 설정
    const jacketImageLocation = !("jacketImage" in myfiles) ? config.defaultBeatJacketImage : myfiles['jacketImage'][0]['location'] as string;

    //* wavFile 없는 경우 -> 오류 반환
    if(!("wavFile" in myfiles)) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_WAV_FILE));
    const wavFilelocation = myfiles['wavFile'][0]['location'] as string;

    const portfolioDTO: ProducerPortfolioDTO = req.body; 

    //portfolioDTO.category = await convertCategory(portfolioDTO.category);

    const data = await mypageService.postProducerPortfolio(portfolioDTO, jacketImageLocation as string, wavFilelocation as string);
    if (!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.PRODUCER_PORTFOLIO_UPLOAD_FAIL));

    return res.status(sc.CREATED).send(success(sc.CREATED, rm.PRODUCER_PORTFOLIO_UPLOAD_SUCCESS, data));
};

const createVocalPortfolio = async(req: Request, res: Response) => {
    const myfiles = JSON.parse(JSON.stringify(req.files));

    //* 재킷이미지 없는 경우 -> default jacketImage로 설정
    const jacketImageLocation = !("jacketImage" in myfiles) ? config.defaultBeatJacketImage : myfiles['jacketImage'][0]['location'] as string;

    //* wavFile 없는 경우 -> 오류 반환
    if(!("wavFile" in myfiles)) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_WAV_FILE));
    const wavFilelocation = myfiles['wavFile'][0]['location'] as string;

    const portfolioDTO: VocalPortfolioDTO = req.body; 

    //portfolioDTO.category = await convertCategory(portfolioDTO.category);

    const data = await mypageService.postVocalPortfolio(portfolioDTO, jacketImageLocation as string, wavFilelocation as string);
    if (!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.VOCAL_PORTFOLIO_UPLOAD_FAIL));

    return res.status(sc.CREATED).send(success(sc.CREATED, rm.VOCAL_PORTFOLIO_UPLOAD_SUCCESS, data));
};

const updateProducerTitlePortfolio = async(req: Request, res: Response) => {
    try {
        const { oldId, newId } = req.query;
        const { userId, tableName } = req.body;

        const data = await mypageService.updateProducerTitle(Number(oldId), Number(newId), Number(userId));
        if (!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.PRODUCER_PORTFOLIO_TITLE_UPDATE_FAIL));

        return res.status(sc.OK).send(success(sc.OK, rm.PRODUCER_PORTFOLIO_TITLE_UPDATE_SUCCESS, data));
    }
    catch(err) {
        const message: SlackMessageFormat = {
            color: slackAlarm.colors.danger,
            title: 'Track-1 서버 에러',
            text: err.message,
            fields: [
               {
                  title: 'Error Stack:',
                  value: `\`\`\`${err.stack}\`\`\`` //여기서 ```를 추가해서 마크다운 형태로 보내줍니다.
               }
            ]
         };
         slackAlarm.sendMessage(message); //슬랙에게 알림 전송
        return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    };
};

const updateVocalTitlePortfolio = async(req: Request, res: Response) => {
    try {
        const { oldId, newId } = req.query;
        const { userId, tableName } = req.body;
        
        const data = await mypageService.updateVocalTitle(Number(oldId), Number(newId), Number(userId));
        if (!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.VOCAL_PORTFOLIO_TITLE_UPDATE_FAIL));

        return res.status(sc.OK).send(success(sc.OK, rm.VOCAL_PORTFOLIO_TITLE_UPDATE_SUCCESS, data));
    }
    catch{
        return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    };
};

const getMypage = async(req:Request, res: Response) => {

    const { userId, tableName } = req.body;
    const { page, limit } = req.query;

    if(tableName == 'producer'){
        const data = await profileService.getProducerProfileData(+userId, +userId, tableName, Number(page), Number(limit));
        if(!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_PRODUCER_ID));

        return res.status(sc.OK).send(success(sc.OK, rm.READ_PRODUCER_PROFILE_SUCCESS, data ));
    }

    if(tableName == 'vocal'){
        const data = await profileService.getVocalProfileData(+userId, +userId, tableName, Number(page), Number(limit));
        if(!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_VOCAL_ID));

        return res.status(sc.OK).send(success(sc.OK, rm.READ_VOCAL_PROFILE_SUCCESS, data));
    }
}

const mypageController = {
    createProducerPortfolio,
    createVocalPortfolio,
    updateProducerTitlePortfolio,
    updateVocalTitlePortfolio,
    getMypage,
};

export default mypageController;