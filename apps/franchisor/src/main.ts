import { NestFactory } from '@nestjs/core';
import { FranchisorModule } from './franchisor.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  // const app = await NestFactory.create(FranchisorModule);
  // await app.listen(3001);

  // const app = await NestFactory.createMicroservice(FranchisorModule, {
  //   transport: Transport.TCP,
  //   options: {
  //     port: 3001,
  //   },
  // });

  
	const app = await NestFactory.create(FranchisorModule);
  app.enableCors();
	const options = new DocumentBuilder()
		.setTitle('API docs')
		.addTag('franchisor')
		.addTag('tasks')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('/', app, document);

  // microservice #1
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options:{
      host: '127.0.0.1',
      port: 3001
    }
  })

  // microservice #2
	const microserviceRMQ = app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: [ 'amqp://localhost:5672' ],
			queue: 'cats_queue',
			queueOptions: {
				durable: false
			}
		}
	});

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.startAllMicroservices();
	await app.listen(3001);
  console.log(`franchisor- ${await app.getUrl()}`);

  // const app = await NestFactory.createMicroservice(FranchisorModule, {
  //   transport: Transport.TCP,
  //   options: {
  //     host: '0.0.0.0',
  //     port: new ConfigService().get('port'),
  //   },
  // } as TcpOptions);
  // await app.listenAsync();
}
bootstrap();
