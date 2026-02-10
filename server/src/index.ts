import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import tasksRouter from './routes/tasks';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/tasks', tasksRouter);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
