import winston, { transports, format } from 'winston';

// TODO: add handleRejections to logger, when it will be exposed in ts api

const fileFormatting =  format.combine(
  format.timestamp(),
  format.json()
);

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new transports.File({
      dirname: 'logs',
      filename: 'combined.log',
      format: fileFormatting
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      dirname: 'logs',
      filename: 'exceptions.log',
      format: fileFormatting
    })
  ],
  handleExceptions: true,
  exitOnError: false
});

if (process.env.NODE_ENV !== 'production') {
  const colorizer = format.colorize();
  const formatting = format.combine(
    format.timestamp(),
    format.simple(),
    format.printf(msg => {
      const prefix = colorizer.colorize(msg.level, `[${ msg.timestamp }] [${ msg.level.toUpperCase() }]: `);
      return prefix + msg.message;
    })
  );
  logger.add(new transports.Console({ format: formatting }));
}

export { logger as Logger };