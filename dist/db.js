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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBCollection = void 0;
require("reflect-metadata");
const dotenv = __importStar(require("dotenv"));
const inversify_1 = require("inversify");
const mongodb_1 = require("mongodb");
dotenv.config();
let MongoDBCollection = (() => {
    let _classDecorators = [(0, inversify_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MongoDBCollection = _classThis = class {
        constructor() {
            const mongoUrl = process.env.MONGO_LOCAL_URL;
            if (!mongoUrl) {
                throw new Error("Не могу подключиться к кластеру. Проверьте MONGO_LOCAL_URL в .env");
            }
            this.client = new mongodb_1.MongoClient(mongoUrl);
        }
        connectDB() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.client.connect();
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
            });
        }
        // Удобно для тестов/тормознутых подключений — закрыть подключение
        close() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.client.close();
            });
        }
    };
    __setFunctionName(_classThis, "MongoDBCollection");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MongoDBCollection = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MongoDBCollection = _classThis;
})();
exports.MongoDBCollection = MongoDBCollection;
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
