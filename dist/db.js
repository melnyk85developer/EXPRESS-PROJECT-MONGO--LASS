"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBCollection = void 0;
require("reflect-metadata");
const dotenv = __importStar(require("dotenv"));
const inversify_1 = require("inversify");
const mongodb_1 = require("mongodb");
dotenv.config();
let MongoDBCollection = class MongoDBCollection {
    constructor() {
        const mongoUrl = process.env.MONGO_LOCAL_URL;
        // const mongoUrl = process.env.MONGO_URL
        if (!mongoUrl) {
            throw new Error("Не могу подключиться к кластеру. Проверьте MONGO_LOCAL_URL в .env");
        }
        this.client = new mongodb_1.MongoClient(mongoUrl);
    }
    get usersCollection() {
        return this.getCollection("users");
    }
    get blogsCollection() {
        return this.getCollection("blogs");
    }
    get postsCollection() {
        return this.getCollection("posts");
    }
    get commentsCollection() {
        return this.getCollection("comments");
    }
    get tokensCollection() {
        return this.getCollection("tokens");
    }
    get requestsCollection() {
        return this.getCollection("requests");
    }
    get devicesCollection() {
        return this.getCollection("devices");
    }
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
            this.DB = this.client.db("socialnetwork");
            yield this.DB.command({ ping: 1 });
            console.log("✅ Успешное подключение к MongoDB 👍");
        });
    }
    getCollection(name) {
        if (!this.DB)
            throw new Error("DB не инициализирована. Вызови connect() перед этим.");
        return this.DB.collection(name);
    }
};
exports.MongoDBCollection = MongoDBCollection;
exports.MongoDBCollection = MongoDBCollection = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], MongoDBCollection);
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
