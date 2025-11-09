import express, { Request, Response } from 'express';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
  res.send('Hello World');
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
