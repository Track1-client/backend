import multer from "multer";
import multerS3 from "multer-s3";
import config from "../../config";
import s3 from "../../config/s3Config";


//? 파일 타입 검사 
const fileFilter = (req: Express.Request, file: Express.MulterS3.File, cb: any ) => {
    if (!file) cb(new Error('no image'), false);

    var ext = file.mimetype.split('/')[1];    //! ex) image/jpg 에서 jpg 추출
    var type = file.mimetype;                 //! ex) image/jpg 전체 

        (type.startsWith('image') && ['png', 'jpg', 'jpeg'].includes(ext)) ? cb(null, true)
    : (!['png', 'jpg', 'jpeg'].includes(ext)) ? cb(new Error('이미지파일 형식은 .png/.jpg/.jpeg이어야함.'))  //! 이미지 파일 형식이 옳지 않은 경우
    : cb(new Error('Only image files are allowed'));   //! 아예 이미지가 아닌 경우 
}


//! 프로듀서 프로필 이미지 업로드 
const Prod_ProfileImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.imageBucketName, 
        contentType: multerS3.AUTO_CONTENT_TYPE, //? mimetype 은 자동으로 설정
        acl: "public-read", // Access control for the file
        key: function (req: Express.Request, file: Express.MulterS3.File, cb) {
            var  newFileName = Date.now() + "-" + file.originalname;
            var fullPath = 'profileImage/producerProfileImage/'+ newFileName;
            cb(null, fullPath);
        },
    }),
    fileFilter: fileFilter,
}).single('imageFile');


//! 보컬 프로필 이미지 업로드 
const Vocal_ProfileImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.imageBucketName, 
        contentType: multerS3.AUTO_CONTENT_TYPE, //? mimetype 은 자동으로 설정
        acl: "public-read", // Access control for the file
        key: function (req: Express.Request, file: Express.MulterS3.File, cb) {
            var  newFileName = Date.now() + "-" + file.originalname;
            var fullPath = 'profileImage/vocalProfileImage/'+ newFileName;
            cb(null, fullPath);
        },
    }),
    fileFilter: fileFilter,
}).single('imageFile');


export {
    Prod_ProfileImage,
    Vocal_ProfileImage,
};
