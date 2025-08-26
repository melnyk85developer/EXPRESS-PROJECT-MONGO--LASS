import "reflect-metadata";
import { app } from './app';
import * as dotenv from 'dotenv';
import { mongoDBCollection } from "./shared/container/compositionRootCustom";
// import { MongoDBCollection } from "./db";
// import { container } from "./shared/container/iocRoot";
// import { connectDB } from "./db";


dotenv.config();

const port = process.env.PORT || 5001

// const mongoDB = container.resolve(MongoDBCollection)

const startApp = async () => {
    await mongoDBCollection.connectDB()
    app.listen(port, () => {
        console.log(`Сервер стартанул, порт ${port}`)
    })
}
startApp();