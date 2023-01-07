import { Router, Request, Response } from "express";
import { sc } from '../constants';
import { fail } from '../constants/response';
import { profileController } from "../controller";
import { auth, Check_Pagination_Value } from '../middlewares';

const router: Router = Router();

router.get('/producer/:producerId', Check_Pagination_Value, auth, profileController.getProducerProfile);
router.get('/producer/:producerId/beats', Check_Pagination_Value, auth, profileController.getOpenedBeats);
router.get('/vocal/:vocalId', Check_Pagination_Value, auth, profileController.getVocalProfile);

export default router;