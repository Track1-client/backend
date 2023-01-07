import { Router, Request, Response } from "express";
import { sc } from '../constants';
import { fail } from '../constants/response';
import { vocalsController } from '../controller';
import { auth, Check_Pagination_Value } from '../middlewares';

const router: Router = Router();


router.get('/', Check_Pagination_Value, auth, vocalsController.getAllVocals);
router.get('/filter', Check_Pagination_Value, auth, vocalsController.getFilteringVocals);

export default router;