import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitMQService } from './rabbitmq.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { delay, of } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly rabbitMQService: RabbitMQService
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('rmq-send')
  async sendRmq() {
    this.rabbitMQService.send('rabbit-mq-producer', {
      message: this.appService.getHello(),
    }).catch((e) =>{
      console.log("error", e)
    });
    return 'Message sent to the queue!';
  }

  @MessagePattern('rabbit-mq-another')
	public async execute(@Payload() data: any, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const orginalMessage = context.getMessage();
		console.log('data got at gateway', data);
		channel.ack(orginalMessage);
	}

  
  @Get('/ping-tcp-franchisor')
  pingServiceTCP() {
    console.log("apigateway - ping to service-a")
    return this.rabbitMQService.pingServiceTCP();
  }

  @MessagePattern({ cmd: 'wrong' })
  ping(arg: any) {
    console.log("service-gateway")
    return of('sending from gateway').pipe(delay(500));
  }
}
