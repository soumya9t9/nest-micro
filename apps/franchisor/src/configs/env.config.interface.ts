interface IMongodbConfigProps {
	connectionString: string;
	databaseName: string;
}

export interface IConfigProps {
	port: number;
	mongodb: {
		database: IMongodbConfigProps;
	};
	jwtSecret: string;
	aws: {
		accessKeyId: string;
		secretAccessKey: string;
	};
}

export enum envKeys {
	'PORT' = 'PORT',
	'MONGODB_CONNECTION_STRING' = 'MONGODB_CONNECTION_STRING',
	'NODE_ENV' = 'NODE_ENV',
	'AWS_ACCESS_KEY_ID' = 'AWS_ACCESS_KEY_ID',
	'AWS_SECRET_ACCESS_KEY' = 'AWS_SECRET_ACCESS_KEY',
	'JWT_SECRET' = 'JWT_SECRET'
}

export interface IEnvConfig {
	PORT: number;
	MONGODB_CONNECTION_STRING: string;
	NODE_ENV: string;
	AWS_ACCESS_KEY_ID: string;
	AWS_SECRET_ACCESS_KEY: string;
	JWT_SECRET: string;
	POSTGRES_USERNAME: string,
	POSTGRES_PORT: number,
	POSTGRES_URL: string,
	POSTGRES_SCHEMA: string
}
