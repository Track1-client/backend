import { Router, Request, Response } from "express";
import { tracksController } from '../controller';
import { auth } from '../middlewares';

const router: Router = Router();


router.get('/:beatId', auth, tracksController.getTracks);


export default router;