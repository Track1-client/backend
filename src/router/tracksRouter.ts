import { Router, Request, Response, NextFunction } from "express";
import { tracksController } from '../controller';
import { auth, Beat_WavAndImage, Comment_wav_file } from '../middlewares';
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

router.post(
    '/:beatId', 
    (req: Request, res: Response, next: NextFunction) => {
        Comment_wav_file(req, res, err => {  
            if (err) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, err.message));
            next();
        })
    },
    auth, 
    tracksController.postBeatComment
);

router.get('/comments/:beatId', auth, tracksController.getAllComment);
router.get('/filter', auth, tracksController.getFilteringTracks);

export default router;