import { Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import config from '../config';
import { ProducerPortfolioDTO } from '../interfaces/mypage';
import convertCategory from '../modules/convertCategory';
import { mypageService } from '../service';

const createProducerPortfolio = async(req: Request, res: Response) => {
    const myfiles = JSON.parse(JSON.stringify(req.files));

    //* 재킷이미지 없는 경우 -> default jacketImage로 설정
    const jacketImageLocation = !("jacketImage" in myfiles) ? config.defaultBeatJacketImage : myfiles['jacketImage'][0]['location'] as string;

    //* wavFile 없는 경우 -> 오류 반환
    if(!("wavFile" in myfiles)) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_WAV_FILE));
    const wavFilelocation = myfiles['wavFile'][0]['location'] as string;

    const portfolioDTO: ProducerPortfolioDTO = req.body; 

    portfolioDTO.category = convertCategory(portfolioDTO.category);

    const data = await mypageService.postProducerPortfolio(portfolioDTO, jacketImageLocation as string, wavFilelocation as string);
    if (!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.PRODUCER_PORTFOLIO_UPLOAD_FAIL));

    return res.status(sc.CREATED).send(success(sc.CREATED, rm.PRODUCER_PORTFOLIO_UPLOAD_SUCCESS, {"producerPortfolioId": data.id}));
};

const mypageController = {
    createProducerPortfolio,
};

export default mypageController;