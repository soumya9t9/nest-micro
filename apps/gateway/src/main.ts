import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
	// const app = await NestFactory.create(AppModule);
	// await app.listen(3000);

	const app = await NestFactory.create(AppModule);
	app.enableCors();
	
	const options = new DocumentBuilder()
		.setTitle('API docs')
		.addTag('api gateway')
		.addTag('tasks')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('/', app, document);

	// microservice #1
	// app.connectMicroservice<MicroserviceOptions>({
	// 	transport: Transport.TCP,
	// 	options: {
	// 	  host: '127.0.0.1',
	// 	  port: 3300
	// 	}
	//   })

	// // microservice #2
	// const microserviceRMQ = app.connectMicroservice<MicroserviceOptions>({
	// 	transport: Transport.RMQ,
	// 	options: {
	// 		urls: [ 'amqp://localhost:5672' ],
	// 		queue: 'cats_queue',
	// 		queueOptions: {
	// 			durable: false
	// 		}
	// 	}
	// });

	// await app.startAllMicroservices();
	await app.listen(3300);
	console.log(`gateway- ${await app.getUrl()}`);
}
bootstrap();
