import { Controller, Get } from '@nestjs/common';
import { FranchisorService } from './franchisor.service';
import { MessagePattern, RmqContext, Ctx, Payload } from '@nestjs/microservices';
import { RabbitMQService } from './rabbitmq.service';
import { delay, of } from 'rxjs';

@Controller()
export class FranchisorController {
	constructor(
		private readonly franchisorService: FranchisorService,
		private readonly rabbitMQService: RabbitMQService
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
    console.log("service-ppr")
    return of('sending from franchisor').pipe(delay(500));
  }

  @Get('/ping-tcp-gateway')
  pingServiceTCP() {
    console.log("franchisor - ping to gateway")
    return this.rabbitMQService.pingServiceTCP();
  }
}
