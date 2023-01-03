import s3 from '../config/s3Config';
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const fetch = require("node-fetch");
var fs = require('fs');
var https = require('https');
import { Blob } from 'buffer';
import { type } from 'os';

const blobToFile = (theBlob: Blob, fileName:string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;

    return theBlob as unknown as File;
}

const downloadBeatFile = async(url: string, bucketName: string) : Promise<any> => {
    try {
        //! signedurl 가져오기
        const client = s3;
        const getObjectParams = { Bucket: bucketName, Key: url };
        
        const command = new GetObjectCommand(getObjectParams);
        const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
        
        //!  가져온 url로 파일 받기 
        const ext = url.split(".").pop(); // url 구조에 맞게 수정할 것
        const filename = url.split("/").pop(); 
        
        let metadata = {
            type: `audio/${ext}`
        };

        const response = await fetch(url);
        const blob = await response.blob();

        const blobObj = new Blob([blob], metadata);

        const arrayBuffer = await blobObj.arrayBuffer();
        const file = blobToFile(blobObj, filename as string);
        return file;
        
    } catch (error) {
        console.error(error);
        return null;
    }
};




export default downloadBeatFile;