import { Router, Request, Response } from "express";
import { sc } from '../constants';
import { fail } from '../constants/response';
import { profileController } from "../controller";
import { auth, Beat_WavAndImage, Comment_wav_file } from '../middlewares';

const router: Router = Router();

router.get('/producer/:producerId', auth, profileController.getProducerProfile);

export default router;