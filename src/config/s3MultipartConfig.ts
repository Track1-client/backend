import AWS from 'aws-sdk';
import config from "../config";

const multipartS3 = new AWS.S3({
    region: "ap-northeast-2",
    accessKeyId: config.s3AccessKey,
    secretAccessKey: config.s3SecretKey,
});

export default multipartS3;