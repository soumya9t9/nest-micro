/**
 * @Note: Not using  
 * */

import { IConfigProps } from './env.config.interface';

export const configuration = (): IConfigProps => ({
	port: parseInt(process.env.PORT, 10) || 3001,
	mongodb: {
		database: {
			connectionString: process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017',
			databaseName: process.env.NODE_ENV || 'local'
		}
	},
	aws: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	},
	jwtSecret: process.env.JWT_SECRET
});
