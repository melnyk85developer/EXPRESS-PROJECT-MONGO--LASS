import "reflect-metadata";
import { app } from './app';
import * as dotenv from 'dotenv';
import { container } from "./shared/container/iocRoot";
import { MongoDBCollection } from "./db";
// import { MongoDBCollection } from "./db";
// import { connectDB } from "./db";

dotenv.config();

const port = process.env.PORT || 5001

const mongoDBCollection = container.get(MongoDBCollection)

const startApp = async () => {
    await mongoDBCollection.connectDB()
    app.listen(port, () => {
        console.log(`Сервер стартанул, порт ${port}`)
    })
}
startApp();