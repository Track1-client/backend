import { NextFunction } from 'express';
import multer from "multer";
import multerS3 from "multer-s3";
import config from "../../config";
import s3 from "../../config/s3Config";

//? 파일 타입 검사 
const fileFilter = (req: Express.Request, file: Express.MulterS3.File, cb: any ) => {
    var ext = file.mimetype.split('/')[1];    //! ex) image/jpg 에서 jpg 추출
    var type = file.mimetype;                 //! ex) image/jpg 전체 
    console.log(file);
    console.log(ext);
    console.log(type);
    (type.startsWith('image') && ['png', 'jpg', 'jpeg'].includes(ext)) ? cb(null, true)
    : (type.startsWith('audio') && ( ext==='wav' || ext==='wave' || ext==='mp3' || ext==='mpeg')) ? cb(null, true) 
    : (!['png', 'jpg', 'jpeg', 'wav', 'wave', 'mp3', 'mpeg'].includes(ext)) ? cb(new Error('오디오파일 형식은 .wav/.mp3, 이미지파일 형식은 .png/.jpg/.jpeg이어야함.'))
    : cb(new Error('Only image files or audio files are allowed'));   //! 아예 오디오나 이미지가 아닌 경우 
};

//? 게시물 이미지+wav
const Beat_WavAndImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.bothWavImageBucketName, 
        contentType: multerS3.AUTO_CONTENT_TYPE, //? mimetype 은 자동으로 설정
        acl: "public-read", // Access control for the file
        key: function (req: Express.Request, file: Express.MulterS3.File, cb) {
            
            var  newFileName = Date.now() + "-" + file.originalname;
            var fullPath = 'beat/'+ newFileName;
            cb(null, fullPath);
        },
    }),
    fileFilter: fileFilter,
}).fields([  //! router.post('/', upload.single('file'), imageController.createImage); -> upload뒤에 fields 어쩌구 안써도 됨 
    {name: 'jacketImage', maxCount: 1},
    {name: 'wavFile', maxCount: 1}
]);   


//? 프로듀서 포트폴리오 이미지+wav
const Prod_Portfolio_WavAndImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.bothWavImageBucketName, 
        contentType: multerS3.AUTO_CONTENT_TYPE, //? mimetype 은 자동으로 설정
        acl: "public-read", // Access control for the file
        key: function (req: Express.Request, file: Express.MulterS3.File, cb) {

            var  newFileName = Date.now() + "-" + file.originalname;
            var fullPath = 'portfolio/producer/'+ newFileName;
            cb(null, fullPath);
        },
    }),
    fileFilter: fileFilter,
}).fields([ 
    {name: 'jacketImage', maxCount: 1},
    {name: 'wavFile', maxCount: 1}
]);   


//? 보컬 포트폴리오 이미지+wav
const Vocal_Portfolio_WavAndImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.bothWavImageBucketName, 
        contentType: multerS3.AUTO_CONTENT_TYPE, //? mimetype 은 자동으로 설정
        acl: "public-read", // Access control for the file
        key: function (req: Express.Request, file: Express.MulterS3.File, cb) {

            var  newFileName = Date.now() + "-" + file.originalname;
            var fullPath = 'portfolio/vocal/'+ newFileName;
            cb(null, fullPath);
        },
    }),
    fileFilter: fileFilter,
}).fields([ 
    {name: 'jacketImage', maxCount: 1},
    {name: 'wavFile', maxCount: 1}
]);   


export {
    Beat_WavAndImage,
    Prod_Portfolio_WavAndImage,
    Vocal_Portfolio_WavAndImage,
};
