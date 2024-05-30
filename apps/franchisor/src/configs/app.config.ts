import { registerAs } from '@nestjs/config';
import { configuration } from './env.config';

export default registerAs('app', configuration);
