import { NextFunction, Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import config from '../config';
import { ProducerPortfolioDTO, VocalPortfolioDTO } from '../interfaces/mypage';
import convertCategory from '../modules/convertCategory';
import { mypageService, profileService } from '../service';
import { NoSoundFile } from '../middlewares/error/constant';


const createProducerPortfolio = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const myfiles = JSON.parse(JSON.stringify(req.files));

        //* 재킷이미지 없는 경우 -> default jacketImage로 설정
        const jacketImageLocation = !("jacketImage" in myfiles) ? config.defaultJacketAndProducerPortfolioImage : myfiles['jacketImage'][0]['location'] as string;

        //* wavFile 없는 경우 -> 오류 반환
        if(!("wavFile" in myfiles)) throw new NoSoundFile(rm.NO_WAV_FILE);
        const wavFilelocation = myfiles['wavFile'][0]['location'] as string;

        const portfolioDTO: ProducerPortfolioDTO = req.body; 

        //portfolioDTO.category = await convertCategory(portfolioDTO.category);

        const data = await mypageService.postProducerPortfolio(portfolioDTO, jacketImageLocation as string, wavFilelocation as string);

        return res.status(sc.CREATED).send(success(sc.CREATED, rm.PRODUCER_PORTFOLIO_UPLOAD_SUCCESS, data));
    } catch (error) {
        return next(error);
    }
};

const createVocalPortfolio = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const myfiles = JSON.parse(JSON.stringify(req.files));

        //* 재킷이미지 없는 경우 -> default jacketImage로 설정
        const jacketImageLocation = !("jacketImage" in myfiles) ? config.defaultVocalPortfolioImage : myfiles['jacketImage'][0]['location'] as string;

        //* wavFile 없는 경우 -> 오류 반환
        if(!("wavFile" in myfiles)) throw new NoSoundFile(rm.NO_WAV_FILE);
        const wavFilelocation = myfiles['wavFile'][0]['location'] as string;

        const portfolioDTO: VocalPortfolioDTO = req.body; 

        //portfolioDTO.category = await convertCategory(portfolioDTO.category);

        const data = await mypageService.postVocalPortfolio(portfolioDTO, jacketImageLocation as string, wavFilelocation as string);

        return res.status(sc.CREATED).send(success(sc.CREATED, rm.VOCAL_PORTFOLIO_UPLOAD_SUCCESS, data));

    } catch (error) {
        return next(error);
    }
};

const updateProducerTitlePortfolio = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const { oldId, newId } = req.query;
        const { userId, tableName } = req.body;

        const data = await mypageService.updateProducerTitle(Number(oldId), Number(newId), Number(userId));
        return res.status(sc.OK).send(success(sc.OK, rm.PRODUCER_PORTFOLIO_TITLE_UPDATE_SUCCESS, data));
    }
    catch(error) {
        return next(error);
    };
};

const updateVocalTitlePortfolio = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const { oldId, newId } = req.query;
        const { userId, tableName } = req.body;
        
        const data = await mypageService.updateVocalTitle(Number(oldId), Number(newId), Number(userId));

        return res.status(sc.OK).send(success(sc.OK, rm.VOCAL_PORTFOLIO_TITLE_UPDATE_SUCCESS, data));
    } catch (error){
        return next(error);
    };
};

const getMypage = async(req:Request, res: Response, next: NextFunction) => {
    try {
        
        const { userId, tableName } = req.body;
        const { page, limit } = req.query;

        if(tableName == 'producer'){
            const data = await profileService.getProducerProfileData(+userId, +userId, tableName, Number(page), Number(limit));
            if(!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_PRODUCER_ID));

            return res.status(sc.OK).send(success(sc.OK, rm.READ_PRODUCER_PROFILE_SUCCESS, data ));
        };

        if(tableName == 'vocal'){
            const data = await profileService.getVocalProfileData(+userId, +userId, tableName, Number(page), Number(limit));
            if(!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_VOCAL_ID));

            return res.status(sc.OK).send(success(sc.OK, rm.READ_VOCAL_PROFILE_SUCCESS, data));
        };
    } catch (error) {
        return next(error);
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


