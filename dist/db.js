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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.connectDB = exports.devicesCollection = exports.requestsCollection = exports.tokensCollection = exports.commentsCollection = exports.postsCollection = exports.blogsCollection = exports.usersCollection = exports.client = void 0;
const dotenv = __importStar(require("dotenv"));
const mongodb_1 = require("mongodb");
dotenv.config();
const mongoUrl = process.env.MONGO_LOCAL_URL;
// const mongoUrl = process.env.MONGO_URL
if (!mongoUrl) {
    throw new Error('Не могу подключиться к кластеру. Проверьте значение MONGO_LOCAL_URL в .env файле');
}
exports.client = new mongodb_1.MongoClient(mongoUrl);
const DB = exports.client.db("socialnetwork");
exports.usersCollection = DB.collection("users");
exports.blogsCollection = DB.collection("blogs");
exports.postsCollection = DB.collection("posts");
exports.commentsCollection = DB.collection("comments");
exports.tokensCollection = DB.collection("tokens");
exports.requestsCollection = DB.collection("requests");
exports.devicesCollection = DB.collection("devices");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.client.connect();
        yield exports.client.db("socialnetwork").command({ ping: 1 });
        console.log("Успешное подключение к серверу -", mongoUrl);
    }
    catch (error) {
        console.error("Не могу подключиться к базе данных:", error);
        yield exports.client.close();
    }
});
exports.connectDB = connectDB;
