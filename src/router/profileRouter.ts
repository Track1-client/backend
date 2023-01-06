import { Router, Request, Response } from "express";
import { sc } from '../constants';
import { fail } from '../constants/response';
import { profileController } from "../controller";
import { auth, Check_Pagination_Value } from '../middlewares';

const router: Router = Router();

router.get('/producer/:producerId', auth, Check_Pagination_Value, profileController.getProducerProfile);
router.get('/producer/:producerId/beats', auth, profileController.getOpenedBeats);
router.get('/vocal/:vocalId', auth, profileController.getVocalProfile);

export default router;