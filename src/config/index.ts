import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: parseInt(process.env.PORT as string, 10) as number,

  //? 데이터베이스
  database: process.env.DATABASE_URL as string,

  //? JWT
  jwtSecret: process.env.JWT_SECRET as string,
  jwtAlgo: process.env.JWT_ALGO as string,

  //? AWS
  s3AccessKey: process.env.S3_ACCESS_KEY as string,
  s3SecretKey: process.env.S3_SECRET_KEY as string,
  wavBucketName: process.env.S3_BUCKET_WAV_FILE as string,                //* only wav file
  imageBucketName: process.env.S3_BUCKET_IMAGE_FILE as string,            //* only image file
  bothWavImageBucketName: process.env.S3_BUCKET_WAV_AND_IMAGE as string,  //* both wav and image file into one object 
  defaultUserImage: process.env.S3_DEFAULT_USER_IMAGE as string,  //* default user image file
  defaultBeatJacketImage: process.env.S3_DEFAULT_BEAT_JACKETIMAGAE as string, //* default beat jacket image file
};