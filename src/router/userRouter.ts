import { Router, Request, Response } from "express";
import { body, header, query } from "express-validator";
import multer from 'multer';
import { sc } from '../constants';
import { fail } from '../constants/response';
import { userController } from '../controller';
import { Prod_ProfileImage, validatorErrorCallback, Vocal_ProfileImage } from '../middlewares';

const router: Router = Router();


//! 프로듀서 회원가입
router.post(
    '/join/producer', 
    (req: Request, res: Response) => {
        Prod_ProfileImage(req, res, err => {  //! 프로듀서 프로필 이미지파일업로드 미들웨어  -> fullPath 받아옴 
            if (err) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, err.message));
        })
    },
    [
        body("ID").notEmpty(), 
        body("PW")
            .notEmpty()
            .isLength({ min: 6 }), 
        body("name").notEmpty(),
        body("contact").notEmpty(), 
        body("category").notEmpty(), 
        body("keyword").notEmpty(),
        validatorErrorCallback
    ],
    userController.createProducer
);

//! 보컬 회원가입
router.post(
    '/join/vocal',
    (req: Request, res: Response) => {
        Vocal_ProfileImage(req, res, err => {  //! 보컬 프로필 이미지파일업로드 미들웨어  -> fullPath 받아옴 
            if (err) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, err.message));
        })
    },
    [
        body("ID").notEmpty(), 
        body("PW")
            .notEmpty()
            .isLength({ min: 6 }), 
        body("name").notEmpty(),
        body("contact").notEmpty(), 
        body("category").notEmpty(), 
        body("keyword").notEmpty(), 
        validatorErrorCallback
    ],
    userController.createVocal
);

//! 프로듀서, 보컬 로그인 
router.post(
    "/login",
    [
        body("ID").notEmpty(),
        body("PW").notEmpty(),
        body("PW").isLength({ min: 6 }),
        validatorErrorCallback
    ],
    userController.logInUser
);

export default router;