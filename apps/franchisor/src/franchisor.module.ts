import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FranchisorController } from './franchisor.controller';
import { FranchisorService } from './franchisor.service';
import { RabbitMQService } from './rabbitmq.service';
import { ExcelService } from './services/excel.service';
import { SseController } from './sse/sse.controller';
import { SseService } from './sse/sse.service';
import { S3bucketService } from './services/s3bucket/s3bucket.service';

@Module({
	imports: [
		EventEmitterModule,
		ClientsModule.register([
      {
        name: 'GATEWAY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3300,
        },
      },
			{
				name: 'RMQ_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: [ 'amqp://localhost:5672' ],
					queue: 'cats_queue',
					queueOptions: {
						durable: false
					}
				}
			}
		]),
	],
	controllers: [ FranchisorController, SseController ],
	providers: [ FranchisorService, RabbitMQService,ExcelService, SseService, S3bucketService ]
})
export class FranchisorModule {}
