import express from 'express';
import morgan from 'morgan';
import logger from './utilities/logger/logger';
import { handleError } from './middleware/error-middleware';
import userRoutes from './api/users/user-routes';

const app = express();

app.use(express.json());
app.use(
  morgan('combined', { stream: { write: (message) => logger.info(message) } }),
);
app.use('/api/users', userRoutes);
app.use(handleError);

export default app;
