import winston from 'winston';

const colorizer = winston.format.colorize();
const formatting = winston.format.combine(
  winston.format.timestamp(),
  winston.format.simple(),
  winston.format.printf(msg => {
    const prefix = colorizer.colorize(msg.level, `[${ msg.timestamp }] [${ msg.level.toUpperCase() }]: `);
    return prefix + msg.message;
  })
);

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ format: formatting })
  ]
});

export { logger as Logger };