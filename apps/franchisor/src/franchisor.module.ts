import { CommonModule } from '@app/common';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { WinstonModule } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import appConfig from './configs/app.config';
import { validateConfig } from './configs/env.config';
import { CusLogger, loggerImplementation } from './configs/logger.config';
import { FranchisorController } from './franchisor.controller';
import { FranchisorService } from './franchisor.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RabbitMQService } from './rabbitmq.service';
import { ExcelService } from './services/excel.service';
import { S3bucketService } from './services/s3bucket/s3bucket.service';
import { SseController } from './sse/sse.controller';
import { SseService } from './sse/sse.service';

@Module({
	imports: [
		EventEmitterModule,
		ConfigModule.forRoot({
			envFilePath: `./env/.env.${process.env.NODE_ENV || 'development'}`,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'test', 'uat', 'production', 'local')
					.default('development'),
				PORT: Joi.number().port().default(3001)
			}),
			isGlobal: true,
			// validationOptions: {
			// 	allowUnknown: false,
			// 	abortEarly: true
			// },
			validate: validateConfig,
			load: [ appConfig ]
		}),
		WinstonModule.forRoot({ instance: loggerImplementation() }),
		ClientsModule.register([
			{
				name: 'GATEWAY_SERVICE',
				transport: Transport.TCP,
				options: {
					host: '127.0.0.1',
					port: 3300
				}
			}
			// {
			// 	name: 'RMQ_SERVICE',
			// 	transport: Transport.RMQ,
			// 	options: {
			// 		urls: [ 'amqp://localhost:5672' ],
			// 		queue: 'cats_queue',
			// 		queueOptions: {
			// 			durable: false
			// 		}
			// 	}
			// }
		]),

		CacheModule.register({
			ttl: 5 * 60 * 60, // seconds
			max: 10 // maximum number of items in cache
		}),
		// CacheModule.registerAsync({
		// 	isGlobal: true,
		// 	useFactory: async () => ({
		// 	  store: await redisStore({
		// 		socket: {
		// 		  host: 'localhost',
		// 		  port: 6379,
		// 		},
		// 	  }),
		// 	}),
		//   }),

		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: parseInt(process.env.POSTGRES_PORT, 5432),
			username: process.env.POSTGRES_USERNAME,
			password: process.env.POSTGRES_PASS,
			database: process.env.POSTGRES_SCHEMA,
			autoLoadEntities: true,
			synchronize: true
		}),
		CommonModule,
		AuthModule,
		UserModule,
		
	],
	controllers: [ FranchisorController, SseController ],
	providers: [
		FranchisorService,
		RabbitMQService,
		ExcelService,
		SseService,
		S3bucketService,
		{ provide: WinstonLogger, useClass: WinstonLogger },
		{
			provide: 'XLog',
			useFactory: () => {
				return new CusLogger().logger;
			}
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor
		}

	]
})
export class FranchisorModule {}
