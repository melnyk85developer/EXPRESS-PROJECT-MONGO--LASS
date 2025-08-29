"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils/utils");
let TokenService = (() => {
    let _classDecorators = [(0, inversify_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TokenService = _classThis = class {
        constructor(
        // @inject(TYPES.MongoDBCollection)
        mongoDB) {
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
    __setFunctionName(_classThis, "TokenService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TokenService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TokenService = _classThis;
})();
exports.TokenService = TokenService;
