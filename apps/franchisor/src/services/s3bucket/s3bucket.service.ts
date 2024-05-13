import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

// const accessKeyId = '',
// const secretAccessKey = '',
@Injectable()
export class S3bucketService {

    AWS_S3_BUCKET = 'nest';
    s3 = new AWS.S3({
        // region: "ap-south-1",
        // accessKeyId,
        // secretAccessKey,
    });

    async uploadFile(file) {
        console.log(file);
        const { originalname } = file;

        return await this.s3_upload(
            file.buffer,
            this.AWS_S3_BUCKET,
            originalname,
            file.mimetype,
        );
    }

    async s3_upload(file, bucket, name, mimetype) {
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ACL: 'public-read',
            ContentType: mimetype,
            ContentDisposition: 'inline',
            CreateBucketConfiguration: {
                LocationConstraint: 'ap-south-1',
            },
        };

        try {
            let s3Response = await this.s3.upload(params).promise();
            return s3Response;
        } catch (e) {
            console.log(e);
        }
    }


    async getPreSignedURL(bucketName: string, key: string, contentType: string) {
        try {
           
            let params = {
                Bucket: bucketName,
                Key: key,
                ContentType: contentType,
                Expires: 1800
            };

            return await this.s3.getSignedUrlPromise('putObject', params);
        } catch (error) {
            throw error;
        }
    }
}
