// app.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { userRoutes } from './app/modules/users/users.route';

const app: Application = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use('/api/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send("Mongoose Express Crud app is running")
})

export default app;