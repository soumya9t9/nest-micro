import { Injectable } from '@nestjs/common';
import * as AWS from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Observable, from, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { EnvKeys } from '../../configs/env.config.interface';

const REGION = 'ap-south-1';
@Injectable()
export class S3bucketService {
	AWS_S3_BUCKET = 'nest-buck';
	s3Client: AWS.S3;
	// s3Client = new AWS.S3Client({
	//     region: REGION,
	//     credentials: {
	//         accessKeyId,
	//         secretAccessKey,
	//     }
	// });

	constructor( private configService: ConfigService) {
		this.s3Client = new AWS.S3({
			region: REGION,
			credentials: {
				accessKeyId: configService.get(EnvKeys.AWS_ACCESS_KEY_ID),
				secretAccessKey: configService.get(EnvKeys.AWS_SECRET_ACCESS_KEY)
			}
		});
		// AWS.config.update({region: 'us-west-2'});
	}

	async uploadFile(file) {
		console.log(file);
		const { originalname } = file;

		return await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, originalname, file.mimetype);

		// return await this.uploadToS3({Body: file.buffer, Bucket: this.AWS_S3_BUCKET, Key: originalname})
	}

	private async uploadToS3(data: AWS.PutObjectCommandInput) {
		// const target = { Bucket, Key, Body };
		try {
			const parallelUploads3 = new Upload({
				client: this.s3Client,
				tags: [], // optional tags
				queueSize: 4, // optional concurrency configuration
				leavePartsOnError: false, // optional manually handle dropped parts
				params: { ...data, ACL: 'public-read' }
			});

			parallelUploads3.on('httpUploadProgress', (progress) => {
				console.log(progress);
			});

			await parallelUploads3.done();
		} catch (e) {
			console.log(e);
		}
	}
	private async s3_upload(file, bucket, name, mimetype) {
		const params: AWS.PutObjectCommandInput = {
			Bucket: bucket,
			Key: String(name),
			Body: file,
			// ACL: 'public-read',
			ContentType: mimetype,
			ContentDisposition: 'inline'
			// CreateBucketConfiguration: {
			//     LocationConstraint: 'ap-south-1',
			// },
		};

		try {
			// this.s3Client.config.endpoint =
			let s3Response = await this.s3Client.putObject(params);
			return s3Response;
		} catch (e) {
			console.log(e);
		}
	}

	async getPreSignedURL(bucketName: string, key: string, contentType: string) {
		// try {
		//     let params = {
		//         Bucket: bucketName,
		//         Key: key,
		//         ContentType: contentType,
		//         Expires: 1800
		//     };
		//     return await this.s3Client.getSignedUrlPromise('putObject', params);
		// } catch (error) {
		//     throw error;
		// }
	}

	private downlaodS3File({ Bucket, Key }: AWS.GetObjectCommandInput): Observable<AWS.GetObjectCommandOutput> {
		return from(this.s3Client.getObject({ Bucket, Key }))
        // .pipe(
		// 	map((res: AWS.GetObjectCommandOutput) => {
		// 		return res.Body;
		// 	})
		// );
	}

	downlaodFile(filePath): Observable<AWS.GetObjectCommandOutput> {
		return this.downlaodS3File({ Bucket: this.AWS_S3_BUCKET, Key: filePath });
	}

    // getPreSignedURLToViewObject() {
    //     return from(this.s3Client.getSignedUrlPromise('getObject', params);)
    // }
}
