import multer from "multer";
import multerS3 from "multer-s3";
import config from "../../config";
import s3 from "../../config/s3Config";


//? 파일 타입 검사 
const fileFilter = (req: Express.Request, file: Express.MulterS3.File, cb: any ) => {
  var ext = file.mimetype.split('/')[1];    //! ex) image/jpg 에서 jpg 추출
  var type = file.mimetype;                 //! ex) image/jpg 전체 

  (type.startsWith('audio') && ['wav', 'wave', 'mp3'].includes(ext)) ? cb(null, true)
  : (!['wav', 'wave', 'mp3'].includes(ext)) ? cb(new Error('오디오파일 형식은 .wav/.mp3이어야함.'))  //! 오디오 파일 형식이 옳지 않은 경우
  : cb(new Error('Only audio files are allowed'));   //! 아예 오디오가 아닌 경우 
};


const Comment_wav_file = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.wavBucketName, 
    contentType: multerS3.AUTO_CONTENT_TYPE, //? mimetype 은 자동으로 설정
    acl: "public-read", // Access control for the file
    key: function (req: Express.Request, file: Express.MulterS3.File, cb) {
        if (!file) cb(new Error('이미지 파일이 존재하지 않습니다'));

        var  newFileName = Date.now() + "-" + file.originalname;
        var fullPath = 'comment/'+ newFileName;
        cb(null, fullPath);
    },
  }),
  fileFilter: fileFilter,
}).single('wavFile');


export {
  Comment_wav_file
};
