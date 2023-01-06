import { Router, Request, Response, NextFunction } from "express";
import { tracksController } from '../controller';
import { auth, Beat_WavAndImage, Check_Pagination_Value, Comment_wav_file } from '../middlewares';
import { sc } from '../constants';
import { fail } from '../constants/response';

const router: Router = Router();


router.get('/', auth, Check_Pagination_Value, tracksController.getAllBeat);
router.get('/filter', auth, Check_Pagination_Value, tracksController.getFilteringTracks);
router.get('/:beatId', auth, tracksController.getClickedBeat);
router.get('/:beatId/download', auth, tracksController.getBeatFile);
router.get('/comments/:beatId', auth, Check_Pagination_Value, tracksController.getAllComment);


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


router.patch('/:beatId/closed', auth, tracksController.updateBeatClosed);


export default router;