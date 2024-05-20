import {
	BadRequestException,
	Controller,
	Get,
	Inject,
	LoggerService,
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
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { delay, from, of } from 'rxjs';
import { FranchisorService } from './franchisor.service';
import { RabbitMQService } from './rabbitmq.service';
import { ExcelService } from './services/excel.service';
import { S3bucketService } from './services/s3bucket/s3bucket.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller()
export class FranchisorController {
	// private logger = {log: (lol) => {}};
	constructor(
		private readonly franchisorService: FranchisorService,
		private readonly rabbitMQService: RabbitMQService,
		private readonly excelService: ExcelService,
		private readonly s3bucket: S3bucketService,
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		// @Inject(Logger) private readonly logger: Logger,
		@Inject('XLog') private readonly xLog: Logger
		// private readonly logger: Logger
	) { 
		this.xLog.error({"error": "found error"});
		this.xLog.info({"logeed": "message"});
		this.logger.error({"error": "found error"});
		this.logger.info({"logeed": "message"});
	}

	@UseInterceptors(CacheInterceptor)
	@CacheKey('hello-key')
	@CacheTTL( 12 * 60 * 60 * 1000) 
	@Get('hello')
	getHello(): string {
		// this.xLog.info({hello: "hello"})
		this.logger.info({hello: "hello"})
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
		this.logger.info('data got at franchisor', data);
		channel.ack(orginalMessage);
	}

	@MessagePattern({ cmd: 'ping' })
	ping(arg: any) {
		this.logger.info('service-ppr');
		return of('sending from franchisor').pipe(delay(500));
	}

	@Get('/ping-tcp-gateway')
	pingServiceTCP() {
		this.logger.info('franchisor - ping to gateway');
		return this.rabbitMQService.pingServiceTCP();
	}

	@Get('/excel/download')
	downloadExcel(@Res() res) {
		this.logger.info('api - download excel');
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
		this.logger.info(file);
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
		this.logger.info(file);
		return this.excelService.readAndEditFile(file).subscribe(({ buffer, filename }) => {
			this.logger.info(buffer);
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
		this.logger.info(file);
		this.s3bucket.uploadFile(file).then((resp) => {
			this.logger.info(resp);
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
			from(value.Body.transformToByteArray()).subscribe((biteArray) => {
				this.logger.info(biteArray);
				res.set('Content-Disposition', `attachment; filename=${fileName}`)
					.set('Content-Type', value.ContentType)
					.send(Buffer.from(biteArray));
			});
		});
	}
}
