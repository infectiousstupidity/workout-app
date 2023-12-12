import express, { Express, NextFunction, Request, Response, json, urlencoded } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/v1/userRoutes';

dotenv.config();

const app: Express = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/api/v1/users', userRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

export default app;
