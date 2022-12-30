import { Router } from "express";
import userRouter from './userRouter';
import tracksRouter from './tracksRouter';
import vocalsRouter from './vocalsRouter';
import profileRouter from './profileRouter';
import mypageRouter from './mypageRouter';


const router: Router = Router();


router.use('/user', userRouter);     //! 회원가입, 로그인 
router.use('/tracks', tracksRouter);
router.use('/vocals', vocalsRouter);
router.use('/profile', profileRouter);
router.use('/mypage', mypageRouter);


export default router;