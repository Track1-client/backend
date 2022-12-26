import { Router } from "express";
import { body, header, query } from "express-validator";
import { userController } from '../controller';
import { Prod_ProfileImage, validatorErrorCallback, Vocal_ProfileImage } from '../middlewares';

const router: Router = Router();


//! 프로듀서 회원가입
router.post(
    '/join/producer',
    Prod_ProfileImage,  //! 프로듀서 프로필 이미지파일업로드 미들웨어
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
    Vocal_ProfileImage, //! 보컬 프로필 이미지파일업로드 미들웨어
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