import { BadRequestException, Body, Controller, Get, Header, HttpStatus, ParseFilePipeBuilder, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FranchisorService } from './franchisor.service';
import { MessagePattern, RmqContext, Ctx, Payload } from '@nestjs/microservices';
import { RabbitMQService } from './rabbitmq.service';
import { delay, of } from 'rxjs';
import { ExcelService } from './services/excel.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller()
export class FranchisorController {
	constructor(
		private readonly franchisorService: FranchisorService,
		private readonly rabbitMQService: RabbitMQService,
		private readonly excelService: ExcelService
	) {}

	@Get('hello')
	getHello(): string {
		return this.franchisorService.getHello();
	}

	@Get('rmq-send')
	async sendRmq() {
		this.rabbitMQService.send('rabbit-mq-another', {
			message: this.franchisorService.getHello()
		});
		return 'Message sent to the queue!';
	}

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
			return res.set('Content-Disposition', `attachment; filename=${filename}`)
      .set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
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
          format: 'binary',
        },
      },
    },
  })
  // @Header('content-type', 'multipart/form-data')
  uploadExcel(@Res() res:Response, @UploadedFile(
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
  ) file: Express.Multer.File) {
    if(!file) throw new BadRequestException('File Missing ! Please upload a file');
    console.log(file);
    // this.excelService.readExcel(file);
    this.excelService.readExcelusingXlsx(file);
    res.status(200).send({message: `successfully uploaded`});
  }
}
