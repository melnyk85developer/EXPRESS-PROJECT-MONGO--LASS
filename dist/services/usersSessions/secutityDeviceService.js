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
exports.secutityDeviceServices = void 0;
const userSessionsRepository_1 = require("./UserSessionsRpository/userSessionsRepository");
const utils_1 = require("../../utils/utils");
const uuid = __importStar(require("uuid"));
const tokenService_1 = require("../../infrastructure/tokenService");
exports.secutityDeviceServices = {
    createSessionServices(userId, ip, userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            const allUserSessions = yield exports.secutityDeviceServices._getAllSessionByUserIdServices(userId);
            const existingSession = allUserSessions.find((session) => session.title === userAgent);
            if (existingSession) {
                // Обновляем существующую сессию
                console.log('secutityDeviceServices: - Обновляем существующую сессию', existingSession);
                return yield this.updateSessionServices(userId, ip, userAgent, existingSession.deviceId);
            }
            else {
                // Создаём новую сессию
                const deviceId = uuid.v4();
                const { accessToken, refreshToken } = yield tokenService_1.tokenService.generateTokens(userId, deviceId);
                if (!accessToken || !refreshToken) {
                    return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_TOKEN_CREATION_ERROR;
                }
                const userToken = yield tokenService_1.tokenService.validateRefreshToken(refreshToken);
                const session = {
                    ip,
                    title: userAgent,
                    userId,
                    deviceId,
                    lastActiveDate: new Date(userToken.iat).toISOString(),
                    expirationDate: new Date(userToken.exp).toISOString(),
                    // expirationDate: add(new Date(), {
                    //     days: 1 ,
                    //     hours: 0,
                    //     minutes: 0
                    // }),
                };
                // console.log(session)
                const isCreatedSession = yield userSessionsRepository_1.userSessionsRepository.createSessionsRepository(session);
                if (isCreatedSession.acknowledged) {
                    return { accessToken, refreshToken };
                }
                else {
                    return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_SESSION_CREATION_ERROR;
                }
            }
        });
    },
    updateSessionServices(userId, ip, userAgent, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accessToken, refreshToken } = yield tokenService_1.tokenService.generateTokens(userId, deviceId);
            if (!accessToken || !refreshToken) {
                return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_TOKEN_CREATION_ERROR;
            }
            const userToken = yield tokenService_1.tokenService.validateRefreshToken(refreshToken);
            const session = {
                ip,
                title: userAgent,
                userId,
                deviceId,
                lastActiveDate: new Date(userToken.iat).toISOString(),
                expirationDate: new Date(userToken.exp).toISOString(),
                // expirationDate: add(new Date(), { 
                //     days: 1 ,
                //     hours: 0,
                //     minutes: 0
                // }),
            };
            const isUpdatedSession = yield userSessionsRepository_1.userSessionsRepository.updateSessionsRepository(session);
            if (isUpdatedSession && isUpdatedSession.acknowledged) {
                return { accessToken, refreshToken };
            }
            else {
                return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_SESSION_UPDATION_ERROR;
            }
        });
    },
    deleteSessionByDeviceIdServices(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userSessionsRepository_1.userSessionsRepository.deleteSessionsByDeviceIdRepository(userId, deviceId);
        });
    },
    deleteAllSessionsServices(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userSessionsRepository_1.userSessionsRepository.deleteAllSessionsRepository(userId, deviceId);
        });
    },
    _getAllSessionsUsersServices() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userSessionsRepository_1.userSessionsRepository._getAllSessionyUsersRepository();
        });
    },
    _getAllSessionByUserIdServices(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userSessionsRepository_1.userSessionsRepository._getAllSessionByUserIdRepository(userId);
        });
    },
    _getSessionByUserIdServices(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userSessionsRepository_1.userSessionsRepository._getSessionByUserIdRepository(userId, deviceId);
        });
    },
    _getSessionByDeviceIdServices(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userSessionsRepository_1.userSessionsRepository._getSessionDeviceByIdRepository(deviceId);
        });
    },
};
