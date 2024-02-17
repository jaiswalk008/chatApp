import AWS from 'aws-sdk';
let ct=0;
export const uploadToS3 = (file:any,fileName:string) =>{
    const BUCKET_NAME='weconnect-docs';
    const USER_KEY = process.env.IAM_USER_ACCESS_KEY;
    const SECRET_KEY = process.env.IAM_USER_SECRET_ACCESS_KEY;
    // console.log(file.buffer);
    //creating an S3 instance
    let s3Bucket = new AWS.S3({
      accessKeyId: USER_KEY,
      secretAccessKey: SECRET_KEY,
    })
    let params ={
      Bucket : BUCKET_NAME,
      Key:fileName+(ct++),
      Body: file.buffer,
      ACL: 'public-read'
    };
    return new Promise((resolve,reject)=>{
      s3Bucket.upload(params , (err:any,res:any) =>{
        if(err) reject(err);
        else {
          console.log(res);
          resolve(res.Location);
        }
      })
    })
   }
  