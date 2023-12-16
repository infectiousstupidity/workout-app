import express from 'express';
import morgan from 'morgan';
import logger from './utilities/logger/logger';
import helmetConfig from './utilities/security/helmet';
import passport from './auth/passport-config';
import authRoutes from './auth/auth-routes';
import userRoutes from './api/users/user-routes';
import { handleError } from './middleware/error-middleware';

import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(helmetConfig);

app.use(
  morgan('combined', { stream: { write: (message) => logger.info(message) } }),
);

app.use(express.json());

app.use(passport.initialize());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.use(handleError);

export default passport;
