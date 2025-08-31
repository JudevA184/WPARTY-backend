import express from 'express';
import authRouter from './routes/auth.routes'; // Import our new router

const app = express();
const port = 3000;

// 1. Add this middleware to parse JSON bodies
app.use(express.json());

// 2. "Plug in" our auth router
app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});