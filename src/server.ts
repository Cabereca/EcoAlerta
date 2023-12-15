import app from './app';
import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const port = (process.env.API_PORT as string) || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
