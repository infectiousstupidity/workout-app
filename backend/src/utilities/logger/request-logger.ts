import morgan, { type StreamOptions } from 'morgan';
import logger from './logger';

const stream: StreamOptions = {
  write: (message) => logger.info(message.trim()),
};

const skip = (): boolean => {
  const env = process.env.NODE_ENV != null || 'development';
  return env !== 'development';
};

const requestLogger = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms',
  { stream, skip },
);

export default requestLogger;
