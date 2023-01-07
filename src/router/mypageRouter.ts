import { Router, Request, Response, NextFunction } from "express";
import { sc } from '../constants';
import { fail } from '../constants/response';
import { mypageController } from '../controller';
import { auth, Prod_Portfolio_WavAndImage, Vocal_Portfolio_WavAndImage, Check_Pagination_Value } from '../middlewares';

const router: Router = Router();

router.post(
    '/producer', 
    (req: Request, res: Response, next: NextFunction) => {
        Prod_Portfolio_WavAndImage(req, res, err => {  
            if (err) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, err.message));
            next();
        })
    },
    auth, 
    mypageController.createProducerPortfolio,
);

router.post(
    '/vocal', 
    (req: Request, res: Response, next: NextFunction) => {
        Vocal_Portfolio_WavAndImage(req, res, err => {  
            if (err) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, err.message));
            next();
        })
    },
    auth, 
    mypageController.createVocalPortfolio,
);

router.patch('/producer', auth, mypageController.updateProducerTitlePortfolio);
router.patch('/vocal', auth, mypageController.updateVocalTitlePortfolio);

router.get('/', auth, Check_Pagination_Value, mypageController.getMypage);

export default router;