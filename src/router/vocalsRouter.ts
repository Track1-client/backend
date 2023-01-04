import { Router, Request, Response } from "express";
import { sc } from '../constants';
import { fail } from '../constants/response';
import { vocalsController } from '../controller';
import { auth } from '../middlewares';

const router: Router = Router();


router.get('/', auth, vocalsController.getAllVocals);
router.get('/filter', auth, vocalsController.getFilteringVocals);

export default router;