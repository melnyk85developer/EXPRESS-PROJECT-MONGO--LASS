import { app } from './app';
import { connectDB } from './db';
import * as dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5001

const startApp = async () => {
  await connectDB()
  app.listen(port, () => {
    console.log(`Сервер стартанул, порт ${port}`)
  })
}
startApp();