import winston from 'winston';
import config from '../config.js';

const customLevelOpt = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        http: 'white',
        debug: 'cyan'
    }
}

let logger;

if (config.env == 'debug') {
    logger = winston.createLogger({
        levels: customLevelOpt.levels,
        transports: [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.simple()
                )
            }),
        ]
    });
} else {
    // Prod
    logger = winston.createLogger({
        levels: customLevelOpt.levels,
        transports: [
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(
                    // winston.format.colorize({ color: customLevelOpt.colors }),
                    winston.format.simple(),
                )
            }),
            new winston.transports.File({
                level: 'error',
                filename: './errors.log',
                format: winston.format.combine(
                    winston.format.simple()
                )
            }),
        ]
    });
}

function getLogDate() {
    const d = new Date();

    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    const millis = d.getMilliseconds().toString().padStart(3, '0');
    return `${year}/${month}/${day}@${hours}:${mins}:${seconds}.${millis}`;
}

export function addLogger(req, res, next) {
    req.logger = logger;
    req.logger.info(`[${getLogDate()}] ${req.method}: ${req.url}`);
    next();
}
