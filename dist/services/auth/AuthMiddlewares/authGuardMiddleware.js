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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddlewares = void 0;
const utils_1 = require("../../../shared/utils/utils");
const settings_1 = require("../../../shared/settings");
const ErRes_1 = require("../../../shared/utils/ErRes");
const inversify_1 = require("inversify");
const authServices_1 = require("../authServices");
const tokenService_1 = require("../../../shared/infrastructure/tokenService");
const securityDeviceService_1 = require("../../usersSessions/securityDeviceService");
const usersQueryRepository_1 = require("../../users/UserRpository/usersQueryRepository");
let AuthMiddlewares = class AuthMiddlewares {
    constructor(authServices, tokenService, securityDeviceServices, usersQueryRepository) {
        this.authServices = authServices;
        this.tokenService = tokenService;
        this.securityDeviceServices = securityDeviceServices;
        this.usersQueryRepository = usersQueryRepository;
        this.oldAuthGuardMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const fromUTF8ToBase64 = (code) => {
                const buff2 = Buffer.from(code, 'utf8');
                const codedAuth = buff2.toString('base64');
                return codedAuth;
            };
            const codedAuth = fromUTF8ToBase64(settings_1.SETTINGS.ADMIN);
            const auth = req.headers['authorization'];
            if (!auth || auth.slice(0, 6) !== 'Basic ' || auth.slice(6) !== codedAuth) {
                return new ErRes_1.ErRes(utils_1.HTTP_STATUSES.UNAUTHORIZED_401, undefined, undefined, req, res);
            }
            else {
                return next();
            }
        });
        this.authLoginMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // console.log('authLoginMiddleware: req.body.loginOrEmail, req.body.password 😡', req.body.loginOrEmail, req.body.password)
            const isUser = yield this.authServices._isAuthServiceForMiddleware(req.body.loginOrEmail, req.body.password);
            if (isUser) {
                req.user = isUser.user;
                next();
                return;
            }
            else {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_PASSWORD_OR_EMAIL_MISSPELLED, undefined, undefined, req, res);
            }
        });
        this.refreshTokenMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const cookieName = 'refreshToken';
            const refreshToken = req.cookies[cookieName];
            const userToken = yield this.tokenService.validateRefreshToken(refreshToken);
            if (userToken === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN, undefined, undefined, req, res);
            }
            if (userToken === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT, undefined, undefined, req, res);
            }
            if (userToken === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT, undefined, undefined, req, res);
            }
            if (userToken === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN, undefined, undefined, req, res);
            }
            if (userToken) {
                const findToken = yield this.tokenService.getRefreshTokenByTokenInBlackList(refreshToken);
                const foundDevice = yield this.securityDeviceServices._getSessionByDeviceIdServices(String(userToken.deviceId));
                // console.log('findToken: - getRefreshTokenByTokenInBlackList', findToken)
                if (findToken || !foundDevice) {
                    // console.log('refreshTokenMiddleware: - BlackList', true)
                    return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST, undefined, undefined, req, res);
                }
                else {
                    // const user = await usersServices._getUserByIdRepo(String((userToken as JwtPayload).userId));
                    // console.log('user1: - ', user1)
                    const user = yield this.usersQueryRepository.getUserByIdRepository(String(userToken.userId));
                    // console.log('refreshTokenMiddleware: user - ', user)
                    if (!user) {
                        return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.NOT_FOUND, undefined, undefined, req, res);
                    }
                    req.user = user;
                    next();
                    return;
                }
            }
            else {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN, undefined, undefined, req, res);
            }
        });
        this.accessTokenMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers['authorization'];
            // console.log('accessTokenMiddleware: - authHeader', authHeader)
            if (typeof authHeader !== 'string' || !authHeader) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED, undefined, undefined, req, res);
            }
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT;
            }
            const token = authHeader.split(' ')[1];
            if (!token || token.length < 10) {
                return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT;
            }
            const userToken = yield this.tokenService.validateAccessToken(token);
            // console.log('accessTokenMiddlewareService userTokenId: - ', userToken)
            if (userToken === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT, undefined, undefined, req, res);
            }
            if (userToken === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT, undefined, undefined, req, res);
            }
            if (userToken === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN, undefined, undefined, req, res);
            }
            // console.log('AuthMiddlewares user: - userToken.userId', (userToken as unknown as JwtPayload).userId)
            const user = yield this.usersQueryRepository.getUserByIdRepository(userToken.userId);
            // console.log('AuthMiddlewares user: - ', user)
            if (!user) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.NOT_FOUND, undefined, undefined, req, res);
            }
            req.user = user;
            // (req as Request & { userId: string }).userId = user._id;
            next();
            return;
        });
        this.sessionTokenMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const cookieName = 'refreshToken';
            const refreshToken = req.cookies[cookieName];
            if (!req.cookies[cookieName]) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT, undefined, undefined, req, res);
            }
            // console.log('sessionTokenMiddleware refreshToken: - ', refreshToken)
            const userToken = yield this.tokenService.validateRefreshToken(refreshToken);
            // console.log('sessionTokenMiddleware: userToken - ', userToken)
            if (userToken.deviceId === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN) {
                // console.log('sessionTokenMiddleware refreshToken: ', refreshToken)
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN, undefined, undefined, req, res);
            }
            req.deviceId = userToken.deviceId;
            return next();
        });
    }
};
exports.AuthMiddlewares = AuthMiddlewares;
exports.AuthMiddlewares = AuthMiddlewares = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(authServices_1.AuthServices)),
    __param(1, (0, inversify_1.inject)(tokenService_1.TokenService)),
    __param(2, (0, inversify_1.inject)(securityDeviceService_1.SecurityDeviceServices)),
    __param(3, (0, inversify_1.inject)(usersQueryRepository_1.UsersQueryRepository)),
    __metadata("design:paramtypes", [authServices_1.AuthServices,
        tokenService_1.TokenService,
        securityDeviceService_1.SecurityDeviceServices,
        usersQueryRepository_1.UsersQueryRepository])
], AuthMiddlewares);
