"use strict";
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
exports.userSessionsRepository = void 0;
const db_1 = require("../../../db");
exports.userSessionsRepository = {
    createSessionsRepository(session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.devicesCollection.insertOne(session);
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    },
    updateSessionsRepository(session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isUpdateSessionRepository = yield db_1.devicesCollection.updateOne({ deviceId: session.deviceId }, { $set: session } // Используем $set для обновления полей
                );
                // console.log('isUpdateSessionRepository: - ', isUpdateSessionRepository);
                return isUpdateSessionRepository;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    },
    deleteSessionsByDeviceIdRepository(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDeleted = yield db_1.devicesCollection.deleteOne({ userId, deviceId });
                // console.log('deleteSessionsByDeviceIdRepository: - isDeleted', isDeleted)
                return isDeleted;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    },
    deleteAllSessionsRepository(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('deleteAllSessionsRepository: - userId & deviceId', userId, deviceId)
            try {
                return yield db_1.devicesCollection.deleteMany({
                    userId,
                    deviceId: { $ne: deviceId } // Удаляем все, где deviceId НЕ равно переданному
                });
            }
            catch (error) {
                console.error(error);
                return { statusCode: -100, message: String(error) };
            }
        });
    },
    _getAllSessionyUsersRepository() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.devicesCollection.find().toArray();
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    },
    _getAllSessionByUserIdRepository(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.devicesCollection.find({ userId }).toArray();
            }
            catch (error) {
                console.error(error);
                return error;
            }
        });
    },
    _getSessionByUserIdRepository(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield db_1.devicesCollection.findOne({ userId, deviceId });
                // console.log('_getSessionByUserIdRepository session: - ', session)
                return session;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    },
    _getSessionDeviceByIdRepository(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const device = yield db_1.devicesCollection.findOne({ deviceId }); // Ищем по deviceId
                // console.log('_getSessionDeviceByIdRepository: - device', device)
                return device;
            }
            catch (error) {
                console.error(error);
                return { statusCode: -100, message: String(error) };
            }
        });
    },
};
