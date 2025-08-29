import "reflect-metadata";
import * as dotenv from 'dotenv'
import { injectable } from 'inversify';
import { MongoClient, Db, Collection } from "mongodb"

dotenv.config();

@injectable()
export class MongoDBCollection {
    private client: MongoClient;
    private DB!: Db;

    // публичные свойства — будут содержать коллекции после connectDB
    public usersCollection!: Collection<any>;
    public blogsCollection!: Collection<any>;
    public postsCollection!: Collection<any>;
    public commentsCollection!: Collection<any>;
    public tokensCollection!: Collection<any>;
    public requestsCollection!: Collection<any>;
    public devicesCollection!: Collection<any>;

    constructor() {
        const mongoUrl = process.env.MONGO_LOCAL_URL;
        if (!mongoUrl) {
            throw new Error("Не могу подключиться к кластеру. Проверьте MONGO_LOCAL_URL в .env");
        }
        this.client = new MongoClient(mongoUrl);
    }

    async connectDB(): Promise<void> {
        await this.client.connect();
        this.DB = this.client.db("socialnetwork");

        // Присваиваем коллекции один раз — стабильно и удобно для моков
        this.usersCollection = this.DB.collection("users");
        this.blogsCollection = this.DB.collection("blogs");
        this.postsCollection = this.DB.collection("posts");
        this.commentsCollection = this.DB.collection("comments");
        this.tokensCollection = this.DB.collection("tokens");
        this.requestsCollection = this.DB.collection("requests");
        this.devicesCollection = this.DB.collection("devices");

        console.log("✅ Успешное подключение к MongoDB 👍");
    }

    // Удобно для тестов/тормознутых подключений — закрыть подключение
    async close(): Promise<void> {
        await this.client.close();
    }
}

// @injectable()
// export class MongoDBCollection {
//     private client: MongoClient;
//     private DB!: Db;

//     constructor() {
//         const mongoUrl = process.env.MONGO_LOCAL_URL;
//         // const mongoUrl = process.env.MONGO_URL
//         if (!mongoUrl) {
//             throw new Error("Не могу подключиться к кластеру. Проверьте MONGO_LOCAL_URL в .env");
//         }
//         this.client = new MongoClient(mongoUrl);
//     }
//     get usersCollection() {
//         return this.getCollection<any>("users");
//     }
//     get blogsCollection() {
//         return this.getCollection<any>("blogs");
//     }
//     get postsCollection() {
//         return this.getCollection<any>("posts");
//     }
//     get commentsCollection() {
//         return this.getCollection<any>("comments");
//     }
//     get tokensCollection() {
//         return this.getCollection<any>("tokens");
//     }
//     get requestsCollection() {
//         return this.getCollection<any>("requests");
//     }
//     get devicesCollection() {
//         return this.getCollection<any>("devices");
//     }
//     async connectDB(): Promise<void> {
//         await this.client.connect();
//         this.DB = this.client.db("socialnetwork")

//         await this.DB.command({ ping: 1 });
//         console.log("✅ Успешное подключение к MongoDB 👍");
//     }

//     getCollection<T extends Document>(name: string): Collection<T> {
//         if (!this.DB) throw new Error("DB не инициализирована. Вызови connect() перед этим.");
//         return this.DB.collection<T>(name);
//     }
// }

// dotenv.config();

// const mongoUrl = process.env.MONGO_LOCAL_URL
// // const mongoUrl = process.env.MONGO_URL
// if(!mongoUrl){
//     throw new Error('Не могу подключиться к кластеру. Проверьте значение MONGO_LOCAL_URL в .env файле')
// }

// export const client = new MongoClient(mongoUrl)
// const DB: Db = client.db("socialnetwork")

// export const usersCollection = DB.collection<any>("users")
// export const blogsCollection = DB.collection<any>("blogs")
// export const postsCollection = DB.collection<any>("posts")
// export const commentsCollection = DB.collection<any>("comments")
// export const tokensCollection = DB.collection<any>("tokens")
// export const requestsCollection = DB.collection<any>("requests")
// export const devicesCollection = DB.collection<any>("devices")

// export const connectDB = async () => {
//     try {
//         await client.connect()
//         await client.db("socialnetwork").command({ ping: 1 })
//         console.log("✅ Успешное подключение к MongoDB 👍", mongoUrl)
//     } catch (error) {
//         console.error("😡 Не могу подключиться к базе данных:", error)
//         await client.close();
//     }
// }