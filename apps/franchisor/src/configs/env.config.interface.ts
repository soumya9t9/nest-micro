import { IsDefined, IsEnum, IsNumberString, MinLength } from 'class-validator';
import { Environment } from './environment.enum';

interface IMongodbConfigProps {
	connectionString: string;
	databaseName: string;
}

export interface IEnvProps {
	port: number;
	mongodb: {
		database: IMongodbConfigProps;
	};
	jwtSecret: string;
	aws: {
		accessKeyId: string;
		secretAccessKey: string;
	};
	google: {
		clientID: string;
		clientSecret: string;
	};
}

export enum EnvKeys {
	'PORT' = 'PORT',
	'MONGODB_CONNECTION_STRING' = 'MONGODB_CONNECTION_STRING',
	'NODE_ENV' = 'NODE_ENV',
	'AWS_ACCESS_KEY_ID' = 'AWS_ACCESS_KEY_ID',
	'AWS_SECRET_ACCESS_KEY' = 'AWS_SECRET_ACCESS_KEY',
	'JWT_SECRET' = 'JWT_SECRET',
	'GOOGLE_CLIENT_ID' = 'GOOGLE_CLIENT_ID',
	'GOOGLE_CLIENT_SECRET' = 'GOOGLE_CLIENT_SECRET',

	POSTGRES_PORT='POSTGRES_PORT',
    POSTGRES_USERNAME='POSTGRES_USERNAME',
	POSTGRES_PASS='POSTGRES_PASS',
	POSTGRES_HOST='POSTGRES_HOST',
	POSTGRES_SCHEMA='POSTGRES_SCHEMA'
}

export class EnvironmentVariables {
	/* APP */
	@IsDefined()
	@IsEnum(Environment)
	NODE_ENV: Environment;

	@IsDefined()
	// @IsNumberString()
	// @MinLength(2)
	PORT: number;

	/* AWS */
	AWS_ACCESS_KEY_ID: string;
	AWS_SECRET_ACCESS_KEY: string;

	/* ENCRYPTION */
	@IsDefined() JWT_SECRET: string;

	@IsDefined() PSW_ENC_KEY;

	/* DB */
	@IsDefined() POSTGRES_USERNAME: string;
	@IsDefined() POSTGRES_PASS: string;
	
	@IsDefined()
	// @IsNumberString()
	// @MinLength(1)
	POSTGRES_PORT: number;

	@IsDefined() POSTGRES_HOST: string;

	@IsDefined() POSTGRES_SCHEMA: string;

	@IsDefined() MONGODB_CONNECTION_STRING: string;
}

export interface IEnvironmentVariables extends EnvironmentVariables {}
