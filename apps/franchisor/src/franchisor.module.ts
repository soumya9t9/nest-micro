import { Module } from '@nestjs/common';
import { FranchisorController } from './franchisor.controller';
import { FranchisorService } from './franchisor.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './rabbitmq.service';

@Module({
	imports: [
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
		])
	],
	controllers: [ FranchisorController ],
	providers: [ FranchisorService, RabbitMQService ]
})
export class FranchisorModule {}
