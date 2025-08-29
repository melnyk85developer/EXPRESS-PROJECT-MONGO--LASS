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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddlewares = void 0;
require("reflect-metadata");
const utils_1 = require("../../../shared/utils/utils");
const settings_1 = require("../../../shared/settings");
const ErResSwitch_1 = require("../../../shared/utils/ErResSwitch");
const inversify_1 = require("inversify");
let AuthMiddlewares = (() => {
    let _classDecorators = [(0, inversify_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuthMiddlewares = _classThis = class {
        constructor(
        // @inject(TYPES.AuthServices)
        authServices, 
        // @inject(TYPES.TokenService)
        tokenService, 
        // @inject(TYPES.SecurityDeviceServices)
        securityDeviceServices, 
        // @inject(TYPES.UsersQueryRepository)
        usersQueryRepository) {
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
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.HTTP_STATUSES.UNAUTHORIZED_401);
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
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_PASSWORD_OR_EMAIL_MISSPELLED);
                }
            });
            this.refreshTokenMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                const cookieName = 'refreshToken';
                const refreshToken = req.cookies[cookieName];
                const userToken = yield this.tokenService.validateRefreshToken(refreshToken);
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
                    const findToken = yield this.tokenService.getRefreshTokenByTokenInBlackList(refreshToken);
                    const foundDevice = yield this.securityDeviceServices._getSessionByDeviceIdServices(String(userToken.deviceId));
                    // console.log('findToken: - getRefreshTokenByTokenInBlackList', findToken)
                    if (findToken || !foundDevice) {
                        // console.log('refreshTokenMiddleware: - BlackList', true)
                        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST);
                    }
                    else {
                        // const user = await usersServices._getUserByIdRepo(String((userToken as JwtPayload).userId));
                        // console.log('user1: - ', user1)
                        const user = yield this.usersQueryRepository.getUserByIdRepository(String(userToken.userId));
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
            this.accessTokenMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
                const userToken = yield this.tokenService.validateAccessToken(token);
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
                const user = yield this.usersQueryRepository.getUserByIdRepository(userToken.userId);
                // console.log('user: - ', user.id)
                if (!user) {
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.NOT_FOUND);
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
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT);
                }
                // console.log('sessionTokenMiddleware refreshToken: - ', refreshToken)
                const userToken = yield this.tokenService.validateRefreshToken(refreshToken);
                // console.log('sessionTokenMiddleware: userToken - ', userToken)
                if (userToken.deviceId === utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN) {
                    // console.log('sessionTokenMiddleware refreshToken: ', refreshToken)
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN);
                }
                req.deviceId = userToken.deviceId;
                return next();
            });
        }
    };
    __setFunctionName(_classThis, "AuthMiddlewares");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthMiddlewares = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthMiddlewares = _classThis;
})();
exports.AuthMiddlewares = AuthMiddlewares;
