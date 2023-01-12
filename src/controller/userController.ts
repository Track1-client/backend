import { NextFunction, Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { producerJoinDTO, vocalJoinDTO, userLogInDTO, UserLogInReturnDTO } from '../interfaces';
import jwtHandler from '../modules/jwtHandler';
import { userService } from '../service';
import config from '../config';
import { UserDoesNotExists } from '../middlewares/error/constant';

//! 프로듀서 회원가입
const createProducer = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const profileImage: Express.MulterS3.File = req.file as Express.MulterS3.File;  //! req.file -> single()로 받은 파일 

        if (!profileImage) var location = config.defaultUserImage2 ;   //~ 파일 없는 경우 default image로 설정 
        //return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_IMAGE));  //~ 파일 없는 경우 그냥 오류로 줄 경우 
        else var { location } = profileImage;   
        
        const producerDTO: producerJoinDTO = req.body;
        const data = await userService.createProducer(producerDTO, location as string);

        const accessToken = jwtHandler.sign('producer', data.id);
        const result = {
            id: data.id,
            name: data.name,
            accessToken,
        };
        
        return res.status(sc.CREATED).send(success(sc.CREATED, rm.SIGNUP_SUCCESS, result))
    } catch (error) {
        return next(error);
    };
};


//! 보컬 회원가입
const createVocal = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const profileImage: Express.MulterS3.File = req.file as Express.MulterS3.File;  //! req.file -> single()로 받은 파일 

        if (!profileImage) var location = config.defaultUserImage2 ;   //~ 파일 없는 경우 default image로 설정 
        //return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_IMAGE));  //~ 파일 없는 경우 그냥 오류로 줄 경우 
        else var { location } = profileImage;
        
        const vocalDTO: vocalJoinDTO = req.body;
        const data = await userService.createVocal(vocalDTO, location as string);

        const accessToken = jwtHandler.sign('vocal', data.id);
        const result = {
            id: data.id,
            name: data.name,
            accessToken,
        };
        
        return res.status(sc.CREATED).send(success(sc.CREATED, rm.SIGNUP_SUCCESS, result));
    } catch (error) {
        return next(error);
    };
};


//! 프로듀서, 보컬 로그인
const logInUser = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const userLogInDto: userLogInDTO = req.body;
        const data = await userService.logIn(userLogInDto);
        
        const dataInDict = data as UserLogInReturnDTO;
        const accessToken = jwtHandler.sign(dataInDict.tableName, dataInDict.userId);
    
        const result = {
            tableName: dataInDict.tableName,
            id: dataInDict.userId,
            accessToken,
        };
    
        res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, result));
    } catch (error) {
        return next(error);
    };
};



const userController = {
    createProducer,
    createVocal,
    logInUser,
};

export default userController;