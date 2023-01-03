import { Router, Request, Response, NextFunction } from "express";
import { tracksController } from '../controller';
import { auth, Beat_WavAndImage } from '../middlewares';
import { sc } from '../constants';
import { fail } from '../constants/response';

const router: Router = Router();

router.post(
    '/', 
    (req: Request, res: Response, next: NextFunction) => {
        Beat_WavAndImage(req, res, err => {  
            if (err) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, err.message));
            next();
        })
    },
    auth, 
    tracksController.createBeat
);

router.get('/:beatId', auth, tracksController.getClickedBeat);
router.get('/', auth, tracksController.getAllBeat);
router.get('/:beatId/download', auth, tracksController.getBeatFile);
router.patch('/:beatId/closed', auth, tracksController.updateBeatClosed);

export default router;