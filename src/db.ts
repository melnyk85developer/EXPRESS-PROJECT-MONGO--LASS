import * as dotenv from 'dotenv'
import { MongoClient, Db, Collection } from "mongodb"

dotenv.config();

const mongoUrl = process.env.MONGO_LOCAL_URL
// const mongoUrl = process.env.MONGO_URL
if(!mongoUrl){throw new Error('Не могу подключиться к кластеру. Проверьте значение MONGO_LOCAL_URL в .env файле')}

export const client = new MongoClient(mongoUrl)
const DB: Db = client.db("socialnetwork")

export const usersCollection = DB.collection<any>("users")
export const blogsCollection = DB.collection<any>("blogs")
export const postsCollection = DB.collection<any>("posts")
export const commentsCollection = DB.collection<any>("comments")
export const tokensCollection = DB.collection<any>("tokens")
export const requestsCollection = DB.collection<any>("requests")
export const devicesCollection = DB.collection<any>("devices")

export const connectDB = async () => {
    try {
        await client.connect()
        await client.db("socialnetwork").command({ ping: 1 })
        console.log("Успешное подключение к серверу -", mongoUrl)
    } catch (error) {
        console.error("Не могу подключиться к базе данных:", error)
        await client.close();
    }
}