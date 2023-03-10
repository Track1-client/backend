import { Router, Request, Response, NextFunction } from "express";
import { tracksController } from '../controller';
import { auth, Beat_WavAndImage, Check_Pagination_Value, Comment_wav_file } from '../middlewares';
import { sc } from '../constants';
import { fail } from '../constants/response';

const router: Router = Router();


router.get('/', Check_Pagination_Value, auth, tracksController.getAllBeat);
router.get('/filter', Check_Pagination_Value, auth, tracksController.getFilteringTracks);
router.get('/:beatId', auth, tracksController.getClickedBeat);
router.get('/:beatId/download', auth, tracksController.getBeatFile);
router.get('/comments/:beatId', Check_Pagination_Value, auth, tracksController.getAllComment);

router.get('/:beatId/download', auth, tracksController.getBeatFile);

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
router.patch('/:beatId', auth, tracksController.updateBeatInfo);

router.delete('/:beatId', auth, tracksController.deleteBeat);
router.delete('/comment/:commentId', auth, tracksController.deleteComment);

export default router;