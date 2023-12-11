import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import logger from './utils/logger';

const app = express();

// Middleware configurations
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS

// Morgan integration with Winston for logging HTTP requests
app.use(
	morgan('tiny', {
		stream: { write: (message) => logger.info(message.trim()) },
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define your routes here

export default app;
