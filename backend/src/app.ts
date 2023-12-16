import express from 'express';
import requestLogger from './utilities/logger/request-logger';
import helmetConfig from './utilities/security/helmet';
import passport from './auth/passport-config';
import authRoutes from './auth/auth-routes';
import userRoutes from './api/users/user-routes';
import { handleError } from './middleware/error-middleware';

import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(helmetConfig);
app.use(requestLogger);
app.use(express.json());
app.use(passport.initialize());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use(handleError);

export default app;
