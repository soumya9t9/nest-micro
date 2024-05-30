/**
 * @Note: Not using  
 * */

import { plainToClass } from 'class-transformer';
import { EnvironmentVariables, IEnvProps } from './env.config.interface';
import { validateSync } from 'class-validator';

export const configuration = (): IEnvProps => ({
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
	jwtSecret: process.env.JWT_SECRET,
	google : {
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	}

});


export function validateConfig(configuration: Record<string, unknown>) {
	console.log("validate", configuration)
	const finalConfig = plainToClass(EnvironmentVariables, configuration, {
	  enableImplicitConversion: true,
	});
  
	const errors = validateSync(finalConfig, { skipMissingProperties: false });
  
	let index = 0;
	for (const err of errors) {
	  Object.values(err.constraints).map((str) => {
		++index;
		console.log(index, str);
	  });
	  console.log('\n ***** \n');
	}
	if (errors.length)
	  throw new Error('Please provide the valid ENVs mentioned above');
  
	return finalConfig;
  }