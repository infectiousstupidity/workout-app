import express from 'express';
import requestLogger from './utilities/logger/request-logger';
import helmetConfig from './utilities/security/helmet';
import passport from './auth/passport-config';
import authRoutes from './auth/auth-routes';
import userRoutes from './api/users/user-routes';
import { handleError } from './middleware/error-middleware';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { generalLimiter, authLimiter } from './middleware/rate-limiting';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Workout App API',
    version: '1.0.0',
    description: 'This is a REST API for a workout app',
  },
  servers: [{ url: 'http://localhost:3000/api/v1' }],
};

const options = {
  swaggerDefinition,
  apis: ['./src/api/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(generalLimiter);
app.use(helmetConfig);
app.use(requestLogger);
app.use(express.json());
app.use(passport.initialize());

app.use('/api/v1/auth', authLimiter, authRoutes);

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/users', userRoutes);

app.use(handleError);

export default app;
