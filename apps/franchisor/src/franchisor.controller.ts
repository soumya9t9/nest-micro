import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	RawBodyRequest,
	Req,
	Res,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { delay, from, of } from 'rxjs';
import { FranchisorService } from './franchisor.service';
import { RabbitMQService } from './rabbitmq.service';
import { ExcelService } from './services/excel.service';
import { S3bucketService } from './services/s3bucket/s3bucket.service';
import { createWriteStream } from 'fs';

@Controller()
export class FranchisorController {
	constructor(
		private readonly franchisorService: FranchisorService,
		private readonly rabbitMQService: RabbitMQService,
		private readonly excelService: ExcelService,
		private readonly s3bucket: S3bucketService
	) {}

	@Get('hello')
	getHello(): string {
		return this.franchisorService.getHello();
	}

	// @Get('rmq-send')
	// async sendRmq() {
	// 	this.rabbitMQService.send('rabbit-mq-another', {
	// 		message: this.franchisorService.getHello()
	// 	});
	// 	return 'Message sent to the queue!';
	// }

	@MessagePattern('rabbit-mq-producer')
	public async execute(@Payload() data: any, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const orginalMessage = context.getMessage();
		console.log('data got at franchisor', data);
		channel.ack(orginalMessage);
	}

	@MessagePattern({ cmd: 'ping' })
	ping(arg: any) {
		console.log('service-ppr');
		return of('sending from franchisor').pipe(delay(500));
	}

	@Get('/ping-tcp-gateway')
	pingServiceTCP() {
		console.log('franchisor - ping to gateway');
		return this.rabbitMQService.pingServiceTCP();
	}

	@Get('/excel/download')
	downloadExcel(@Res() res) {
		console.log('api - download excel');
		let data = [
			{
				route: 'INDEL-INMBI',
				originCountry: 'India',
				originCity: 'Delhi',
				destinationCountry: 'India',
				destinationCity: 'Mumbai'
			}
		];
		return this.excelService.downloadExcel(data).subscribe(({ buffer, filename }) => {
			return res
				.set('Content-Disposition', `attachment; filename=${filename}`)
				.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
				.send(buffer);
		});
		// return this.excelService.downloadExcel(data);
	}

	@Post('excel/upload')
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary'
				}
			}
		}
	})
	// @Header('content-type', 'multipart/form-data')
	uploadExcel(
		@Res() res: Response,
		@UploadedFile()
		// new ParseFilePipeBuilder()
		// // .addFileTypeValidator({
		// //   fileType: '.xlsx',
		// // })
		// .addMaxSizeValidator({
		//   maxSize: 1000
		// })
		// .build({
		//   errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
		// }),
		file: Express.Multer.File
	) {
		if (!file) throw new BadRequestException('File Missing ! Please upload a file');
		console.log(file);
		this.excelService.readExcelusingExceljs(file);
		// this.excelService.readExcelusingXlsx(file);
		res.status(200).send({ message: `successfully uploaded` });
	}

	@Post('excel/validate')
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary'
				}
			}
		}
	})
	validateExcel(@Res() res: Response, @UploadedFile() file: Express.Multer.File) {
		if (!file) throw new BadRequestException('File Missing ! Please upload a file');
		console.log(file);
		return this.excelService.readAndEditFile(file).subscribe(({ buffer, filename }) => {
			console.log(buffer);
			return res
				.set('Content-Disposition', `attachment; filename=${filename}`)
				.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
				.send(buffer);
		});
		// res.status(200).send({message: `successfully uploaded`});
	}

	@Post('s3/upload')
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary'
				}
			}
		}
	})
	// @Header('content-type', 'multipart/form-data')
	uploadToS3(@Res() res: Response, @UploadedFile() file: Express.Multer.File) {
		if (!file) throw new BadRequestException('File Missing ! Please upload a file');
		console.log(file);
		this.s3bucket.uploadFile(file).then((resp) => {
			console.log(resp);
			res.status(200).send({ message: `successfully uploaded` });
		});
	}

	@ApiQuery({
		name: 'fileName',
		type: 'string',
		required: true,
		description: 'file name with extension'
	})
	@Get('s3/download/')
	downloadFromS3(@Query('fileName') fileName, @Res() res, @Req() req: RawBodyRequest<Request>) {
		this.s3bucket.downlaodFile(fileName).subscribe((value) => {
			// console.log(value);
			const nodeWriteStream = createWriteStream(fileName, 'binary');
			const stream = new WritableStream({
				write(chunk) {
					nodeWriteStream.write(chunk);
				},
				close() {
					nodeWriteStream.close();
				},
				abort(err) {
					nodeWriteStream.destroy(err);
					throw err;
				}
			});
			value.Body.transformToWebStream().pipeTo(stream).then((v) => {
				nodeWriteStream.pipe(res);
				res
						.set('Content-Disposition', `attachment; filename=${fileName}`)
						.set('Content-Type', value.ContentType)
						.send(nodeWriteStream);
			})
			// from(value.Body.transformToWebStream().pipeTo(res)).subscribe((biteArray) => {
			// 	console.log(biteArray);
			// 	res
			// 		.set('Content-Disposition', `attachment; filename=${fileName}`)
			// 		.set('Content-Type', value.ContentType)
			// 		.send(biteArray);
			// });
		});
	}
}
