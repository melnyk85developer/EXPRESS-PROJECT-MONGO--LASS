import * as dotenv from 'dotenv'
import { injectable } from 'inversify';
import { MongoClient, Db, Collection } from "mongodb"

dotenv.config();

@injectable()
export class MongoDBCollection {
    private client: MongoClient;
    private DB!: Db;
    private isConnected = false; // <<< добавили

    public usersCollection!: Collection<any>;
    public blogsCollection!: Collection<any>;
    public postsCollection!: Collection<any>;
    public commentsCollection!: Collection<any>;
    public tokensCollection!: Collection<any>;
    public requestsCollection!: Collection<any>;
    public devicesCollection!: Collection<any>;

    constructor() {
        const mongoUrl = process.env.MONGO_LOCAL_URL;
        if (!mongoUrl) throw new Error("Нет MONGO_LOCAL_URL в .env");
        this.client = new MongoClient(mongoUrl);
    }

    async connectDB(): Promise<void> {
        if (this.isConnected) return; // <<< идемпотентность

        await this.client.connect();
        this.DB = this.client.db("socialnetwork");

        this.usersCollection = this.DB.collection("users");
        this.blogsCollection = this.DB.collection("blogs");
        this.postsCollection = this.DB.collection("posts");
        this.commentsCollection = this.DB.collection("comments");
        this.tokensCollection = this.DB.collection("tokens");
        this.requestsCollection = this.DB.collection("requests");
        this.devicesCollection = this.DB.collection("devices");

        this.isConnected = true; // <<< отмечаем соединение
        console.log("✅ Успешное подключение к MongoDB 👍");
    }

    get connected() { return this.isConnected; } // <<< удобный флажок

    async close(): Promise<void> {
        await this.client.close();
        this.isConnected = false;
    }
}