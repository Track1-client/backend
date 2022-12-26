import { Router } from "express";
import userRouter from './userRouter';


const router: Router = Router();


router.use('/user', userRouter);    //! 회원가입, 로그인 


export default router;