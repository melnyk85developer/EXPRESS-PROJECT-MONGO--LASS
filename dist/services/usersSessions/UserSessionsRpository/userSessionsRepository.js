"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.UserSessionsRepository = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
// import { devicesCollection } from "../../../db";
const db_1 = require("../../../db");
let UserSessionsRepository = class UserSessionsRepository {
    constructor(
    // @inject(TYPES.MongoDBCollection)
    mongoDB) {
        this.mongoDB = mongoDB;
    }
    createSessionsRepository(session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.mongoDB.devicesCollection.insertOne(session);
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    updateSessionsRepository(session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isUpdateSessionRepository = yield this.mongoDB.devicesCollection.updateOne({ deviceId: session.deviceId }, { $set: session } // Используем $set для обновления полей
                );
                // console.log('isUpdateSessionRepository: - ', isUpdateSessionRepository);
                return isUpdateSessionRepository;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    deleteSessionsByDeviceIdRepository(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDeleted = yield this.mongoDB.devicesCollection.deleteOne({ userId, deviceId });
                // console.log('deleteSessionsByDeviceIdRepository: - isDeleted', isDeleted)
                return isDeleted;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    deleteAllSessionsRepository(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('deleteAllSessionsRepository: - userId & deviceId', userId, deviceId)
            try {
                return yield this.mongoDB.devicesCollection.deleteMany({
                    userId,
                    deviceId: { $ne: deviceId } // Удаляем все, где deviceId НЕ равно переданному
                });
            }
            catch (error) {
                console.error(error);
                return { statusCode: -100, message: String(error) };
            }
        });
    }
    _getAllSessionyUsersRepository() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.mongoDB.devicesCollection.find().toArray();
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    _getAllSessionByUserIdRepository(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.mongoDB.devicesCollection.find({ userId }).toArray();
            }
            catch (error) {
                console.error(error);
                return error;
            }
        });
    }
    _getSessionByUserIdRepository(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield this.mongoDB.devicesCollection.findOne({ userId, deviceId });
                // console.log('_getSessionByUserIdRepository session: - ', session)
                return session;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    _getSessionDeviceByIdRepository(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const device = yield this.mongoDB.devicesCollection.findOne({ deviceId }); // Ищем по deviceId
                // console.log('_getSessionDeviceByIdRepository: - device', device)
                return device;
            }
            catch (error) {
                console.error(error);
                return { statusCode: -100, message: String(error) };
            }
        });
    }
};
exports.UserSessionsRepository = UserSessionsRepository;
exports.UserSessionsRepository = UserSessionsRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [db_1.MongoDBCollection])
], UserSessionsRepository);
