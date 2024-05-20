

import { Injectable, LogLevel, LoggerService } from '@nestjs/common';
import * as winston from 'winston'

// @Injectable()
export class CusLogger {

    public logger: winston.Logger;

    constructor() {
        this.logger = loggerImplementation();
    }
}

export function loggerImplementation() {
    const logger = winston.createLogger({
        //   levels: winston.config.syslog.levels,
        format: winston.format.combine(
            ignorePrivate(),
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.colorize(),
            winston.format.json(),

        ),
        transports: [
            //
            // - Write all logs with importance level of `error` or less to `error.log`
            // - Write all logs with importance level of `info` or less to `combined.log`
            //
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/combined.log' }),
        ],
        exceptionHandlers: [
            new winston.transports.File({ filename: 'logs/exceptions.log' })
        ],
        exitOnError: false
    });

    //
    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    //
    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.simple(),
        }));
    }

    return logger;


    // SyslogConfigSetLevels
}

// Ignore log messages if they have { private: true }
const ignorePrivate = winston.format((info, opts) => {
    if (info.private) { return false; }
    return info;
});