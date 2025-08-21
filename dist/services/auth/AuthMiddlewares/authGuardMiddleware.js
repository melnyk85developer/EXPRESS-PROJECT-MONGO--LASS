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
exports.sessionTokenMiddleware = exports.accessTokenMiddleware = exports.refreshTokenMiddleware = exports.authLoginMiddleware = exports.oldAuthGuardMiddleware = void 0;
const utils_1 = require("../../../utils/utils");
const settings_1 = require("../../../settings");
const authServices_1 = require("../authServices");
const ErResSwitch_1 = require("../../../utils/ErResSwitch");
const secutityDeviceService_1 = require("../../usersSessions/secutityDeviceService");
const usersQueryRepository_1 = require("../../users/UserRpository/usersQueryRepository");
const tokenService_1 = require("../../../infrastructure/tokenService");
const oldAuthGuardMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fromUTF8ToBase64 = (code) => {
        const buff2 = Buffer.from(code, 'utf8');
        const codedAuth = buff2.toString('base64');
        return codedAuth;
    };
    const codedAuth = fromUTF8ToBase64(settings_1.SETTINGS.ADMIN);
    const auth = req.headers['authorization'];
    if (!auth || auth.slice(0, 6) !== 'Basic ' || auth.slice(6) !== codedAuth) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.HTTP_STATUSES.UNAUTHORIZED_401);
    }
    else {
        return next();
    }
});
exports.oldAuthGuardMiddleware = oldAuthGuardMiddleware;
const authLoginMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield authServices_1.authServices._isAuthServiceForMiddleware(req.body.loginOrEmail, req.body.password);
    if (isUser) {
        req.user = isUser.user;
        next();
        return;
    }
    else {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_PASSWORD_OR_EMAIL_MISSPELLED);
    }
});
exports.authLoginMiddleware = authLoginMiddleware;
const refreshTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookieName = 'refreshToken';
    const refreshToken = req.cookies[cookieName];
    const userToken = yield tokenService_1.tokenService.validateRefreshToken(refreshToken);
    if (userToken === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN);
    }
    if (userToken === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT);
    }
    if (userToken === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT);
    }
    if (userToken === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN);
    }
    if (userToken) {
        const findToken = yield tokenService_1.tokenService.getRefreshTokenByTokenInBlackList(refreshToken);
        const foundDevice = yield secutityDeviceService_1.secutityDeviceServices._getSessionByDeviceIdServices(String(userToken.deviceId));
        // console.log('findToken: - getRefreshTokenByTokenInBlackList', findToken)
        if (findToken || !foundDevice) {
            // console.log('refreshTokenMiddleware: - BlackList', true)
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST);
        }
        else {
            // const user = await usersServices._getUserByIdRepo(String((userToken as JwtPayload).userId));
            // console.log('user1: - ', user1)
            const user = yield usersQueryRepository_1.usersQueryRepository.getUserByIdRepository(String(userToken.userId));
            // console.log('refreshTokenMiddleware: user - ', user)
            if (!user) {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.NOT_FOUND);
            }
            req.user = user;
            next();
            return;
        }
    }
    else {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN);
    }
});
exports.refreshTokenMiddleware = refreshTokenMiddleware;
const accessTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    // console.log('accessTokenMiddleware: - authHeader', authHeader)
    if (typeof authHeader !== 'string' || !authHeader) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED);
    }
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT;
    }
    const token = authHeader.split(' ')[1];
    if (!token || token.length < 10) {
        return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT;
    }
    const userToken = yield tokenService_1.tokenService.validateAccessToken(token);
    // console.log('accessTokenMiddlewareService userTokenId: - ', userToken)
    if (userToken === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT);
    }
    if (userToken === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT);
    }
    if (userToken === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN);
    }
    // const user = await usersServices._getUserByIdRepo((token as JwtPayload).userId);
    const user = yield usersQueryRepository_1.usersQueryRepository.getUserByIdRepository(userToken.userId);
    // console.log('user: - ', user.id)
    if (!user) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.NOT_FOUND);
    }
    req.user = user;
    // (req as Request & { userId: string }).userId = user._id;
    next();
    return;
});
exports.accessTokenMiddleware = accessTokenMiddleware;
const sessionTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookieName = 'refreshToken';
    const refreshToken = req.cookies[cookieName];
    if (!req.cookies[cookieName]) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT);
    }
    // console.log('sessionTokenMiddleware refreshToken: - ', refreshToken)
    const userToken = yield tokenService_1.tokenService.validateRefreshToken(refreshToken);
    // console.log('sessionTokenMiddleware: userToken - ', userToken)
    if (userToken.deviceId === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN) {
        // console.log('sessionTokenMiddleware refreshToken: ', refreshToken)
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN);
    }
    req.deviceId = userToken.deviceId;
    return next();
});
exports.sessionTokenMiddleware = sessionTokenMiddleware;
