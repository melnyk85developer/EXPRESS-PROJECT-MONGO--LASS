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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const inversify_1 = require("inversify");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils/utils");
const db_1 = require("../../db");
let TokenService = class TokenService {
    constructor(mongoDB) {
        this.mongoDB = mongoDB;
    }
    generateTokens(payload, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!payload || !deviceId) {
                throw new Error('Payload cannot be null or undefined');
            }
            const accessToken = jsonwebtoken_1.default.sign({
                userId: String(payload)
            }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
            const refreshToken = jsonwebtoken_1.default.sign({
                userId: String(payload),
                deviceId
            }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
            return { accessToken, refreshToken };
        });
    }
    validateAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // Проверка формата JWT токена
            if (typeof token !== 'string' || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) {
                return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT;
            }
            try {
                const userData = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
                if (userData) {
                    return userData;
                }
                else {
                    return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN;
                }
            }
            catch (error) {
                // console.error('Ошибка JWT валидации:', error);
                return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN;
            }
        });
    }
    validateRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof refreshToken !== 'string' || !refreshToken) {
                return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN;
            }
            if (!refreshToken || refreshToken.length < 10) {
                return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT;
            }
            // Проверка формата JWT токена
            if (typeof refreshToken !== 'string' || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(refreshToken)) {
                return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT;
            }
            try {
                const userData = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                if (!userData ||
                    typeof userData !== 'object' ||
                    typeof userData.userId !== 'string' ||
                    !/^[a-f\d]{24}$/i.test(userData.userId) // Проверка на ObjectId
                ) {
                    // console.error('Ошибка: неверный userId в токене', userData);
                    return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN;
                }
                // console.log('tokenService - validateRefreshToken: ', userData);
                return userData;
            }
            catch (error) {
                // console.error('Ошибка JWT валидации:', error);f
                return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN;
            }
        });
    }
    saveRefreshTokenBlackList(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('tokenService - saveBlackListToken: refreshToken', refreshToken)
            try {
                const isSave = yield this.mongoDB.tokensCollection.insertOne({ userId, refreshToken });
                // console.log('saveRefreshTokenBlackList: - isSave', isSave)
                return isSave;
                // if(isSave){
                //     console.log('saveRefreshTokenBlackList: - isSave', isSave)
                //     return isSave.acknowledged
                // }else{
                //     return false
                // }
            }
            catch (error) {
                // console.error(error)
                return utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST;
            }
        });
    }
    deleteRefreshTokenByTokenInBlackList(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenData = yield this.mongoDB.tokensCollection.deleteOne({ refreshToken });
                // console.log('deleteRefreshTokenByTokenInBlackList - tokenData', tokenData)
                return tokenData;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getRefreshTokenByTokenInBlackList(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenData = yield this.mongoDB.tokensCollection.findOne({ refreshToken });
                // console.log('tokenService getRefreshTokenByTokenInBlackList - tokenData', tokenData)
                return tokenData;
            }
            catch (error) {
                console.error(error);
                return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST;
            }
        });
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(db_1.MongoDBCollection)),
    __metadata("design:paramtypes", [db_1.MongoDBCollection])
], TokenService);
