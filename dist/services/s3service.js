"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
let ct = 0;
const uploadToS3 = (file, fileName) => {
    const BUCKET_NAME = 'weconnect-docs';
    const USER_KEY = process.env.IAM_USER_ACCESS_KEY;
    const SECRET_KEY = process.env.IAM_USER_SECRET_ACCESS_KEY;
    // console.log(file.buffer);
    //creating an S3 instance
    let s3Bucket = new aws_sdk_1.default.S3({
        accessKeyId: USER_KEY,
        secretAccessKey: SECRET_KEY,
    });
    let params = {
        Bucket: BUCKET_NAME,
        Key: fileName + (ct++),
        Body: file.buffer,
        ACL: 'public-read'
    };
    return new Promise((resolve, reject) => {
        s3Bucket.upload(params, (err, res) => {
            if (err)
                reject(err);
            else {
                console.log(res);
                resolve(res.Location);
            }
        });
    });
};
exports.uploadToS3 = uploadToS3;
