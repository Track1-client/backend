import { Request, Response } from "express";
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { producerJoinDTO, vocalJoinDTO, userLogInDTO } from '../interfaces';
import jwtHandler from '../modules/jwtHandler';
import { userService } from '../service';


//! 프로듀서 회원가입
const createProducer = async(req: Request, res: Response) => {
    
    const profileImage: Express.MulterS3.File = req.file as Express.MulterS3.File;  //! req.file -> single()로 받은 파일 
    const { location } = profileImage;

    if (!location) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_IMAGE));
    
    const producerDTO: producerJoinDTO = req.body;
    const data = await userService.createProducer(producerDTO, location as string);

    if (!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.ALREADY_ID_OR_NICKNAME));

    const accessToken = jwtHandler.sign(data.id);
    const result = {
        id: data.id,
        name: data.name,
        accessToken,
    };
    
    return res.status(sc.CREATED).send(success(sc.CREATED, rm.SIGNUP_SUCCESS, result))
};


//! 보컬 회원가입
const createVocal = async(req: Request, res: Response) => {

    const profileImage: Express.MulterS3.File = req.file as Express.MulterS3.File;  //! req.file -> single()로 받은 파일 
    const { location } = profileImage;

    if (!location) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_IMAGE));
    
    const vocalDTO: vocalJoinDTO = req.body;
    const data = await userService.createVocal(vocalDTO, location as string);

    if (!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.ALREADY_ID_OR_NICKNAME));

    const accessToken = jwtHandler.sign(data.id);
    const result = {
        id: data.id,
        name: data.name,
        accessToken,
    };
    
    return res.status(sc.CREATED).send(success(sc.CREATED, rm.SIGNUP_SUCCESS, result))
};


//! 프로듀서, 보컬 로그인
const logInUser = async(req: Request, res: Response) => {

    const userLogInDto: userLogInDTO = req.body;
    console.log(userLogInDto);
    
    try {
        const userId = await userService.logIn(userLogInDto);
    
        if (!userId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));
        else if (userId === sc.UNAUTHORIZED)
            return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_PASSWORD));
        
        const accessToken = jwtHandler.sign(userId);
    
        const result = {
            id: userId,
            accessToken,
        };
    
        res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, result));
    } catch (e) {
        console.log(e);
        res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
};



const userController = {
    createProducer,
    createVocal,
    logInUser,
};

export default userController;