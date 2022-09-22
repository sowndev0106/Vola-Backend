
import winston, { transports } from 'winston';
const { combine, timestamp, printf , colorize, simple} = winston.format;
import util from 'util';
const logFormat = printf(({ level, message,  timestamp ,stack}) => {
  if(typeof message ==='object'){
    return `${timestamp} ${level}: ${util.inspect(message || stack, { colors: true})} `;
  }
    return `${timestamp} ${level}: ${message||stack} `;
});

const logger = winston.createLogger({
  defaultMeta: { service: 'user-service' },
  transports: [new transports.Console()],
  format: combine(
    colorize(),
    simple(),
    timestamp({format:'HH:mm:ss'}),
    logFormat
  ),
});
export default logger;
