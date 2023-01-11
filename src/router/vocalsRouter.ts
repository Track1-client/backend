import { Router, Request, Response } from "express";
import { vocalsController } from '../controller';
import { auth, Check_Pagination_Value } from '../middlewares';

const router: Router = Router();

router.get('/filter', Check_Pagination_Value, auth, vocalsController.getFilteringVocals);

export default router;