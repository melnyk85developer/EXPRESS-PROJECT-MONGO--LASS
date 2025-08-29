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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
require("reflect-metadata");
const bcrypt_1 = __importDefault(require("bcrypt"));
const date_fns_1 = require("date-fns");
const uuid = __importStar(require("uuid"));
const mongodb_1 = require("mongodb");
const utils_1 = require("../../shared/utils/utils");
const inversify_1 = require("inversify");
let AuthServices = (() => {
    let _classDecorators = [(0, inversify_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuthServices = _classThis = class {
        constructor(
        // @inject(TYPES.MongoDBCollection)
        mongoDB, 
        // @inject(new LazyServiceIdentifer(() => TYPES.UserService))
        usersServices, 
        // @inject(TYPES.UsersRepository)
        usersRepository, 
        // @inject(TYPES.UsersQueryRepository)
        usersQueryRepository, 
        // @inject(TYPES.SecurityDeviceServices)
        securityDeviceServices, 
        // @inject(TYPES.TokenService)
        tokenService, 
        // @inject(TYPES.TokenService)
        mailService) {
            this.mongoDB = mongoDB;
            this.usersServices = usersServices;
            this.usersRepository = usersRepository;
            this.usersQueryRepository = usersQueryRepository;
            this.securityDeviceServices = securityDeviceServices;
            this.tokenService = tokenService;
            this.mailService = mailService;
        }
        registrationServices(login, password, email) {
            return __awaiter(this, void 0, void 0, function* () {
                // console.log('registrationServices - login, password, email', login, password, email)
                const isLogin = yield this.usersServices._getUserByLoginOrEmail(login);
                const isEmail = yield this.usersServices._getUserByLoginOrEmail(email);
                // console.log('registrationServices - isLogin, isEmail: ', isLogin, isEmail)
                if (!isLogin && !isEmail) {
                    const date = new Date();
                    // date.setMilliseconds(0)
                    const confirmationCode = uuid.v4();
                    const createdAt = date.toISOString();
                    const createUser = {
                        accountData: {
                            userName: login,
                            email,
                            password: password,
                            createdAt: createdAt
                        },
                        emailConfirmation: {
                            confirmationCode: confirmationCode,
                            expirationDate: (0, date_fns_1.add)(new Date(), {
                                hours: 1,
                                minutes: 3
                            }),
                            isConfirmed: false
                        }
                    };
                    const crestedUser = yield this.usersServices.createUserServices(createUser);
                    // console.log('crestedUser: - ', crestedUser)
                    const from = `IT-INCUBATOR <${process.env.SMTP_USER}>`;
                    const to = email;
                    const subject = `Активация аккаунта на сайте ${process.env.PROJEKT_NAME}`;
                    const text = confirmationCode;
                    const html = `<div>
                <h1>Для активации аккаунта на сайте ${process.env.PROJEKT_NAME} перейдите по ссылке</h1>
                <h2>${confirmationCode}</h2>
                <p>
                    To finish registration please follow the link below:
                    <a href="${process.env.API_URL}/auth/confirm-email?code=${confirmationCode}">Подтвердить регистрацию</a>
                </p>
                <button>
                    <a href="${process.env.API_URL}/auth/confirm-email?code=${confirmationCode}">Подтвердить регистрацию</a>
                </button>
            </div>`;
                    const isSend = this.mailService.sendMail(from, to, subject, text, html)
                        .catch(() => console.log('Ошибка отправки сообщения на E-Mail'));
                    if (!isSend) {
                        if (crestedUser.insertedId) {
                            yield this.usersServices.deleteUserServices(crestedUser.insertedId.toString());
                        }
                        return null;
                    }
                    return crestedUser;
                }
                if (isEmail) {
                    return utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_EMAIL_ALREADY_EXISTS;
                }
                if (isLogin) {
                    return utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_LOGIN_ALREADY_EXISTS;
                }
            });
        }
        loginServices(userId, ip, userAgent) {
            return __awaiter(this, void 0, void 0, function* () {
                const session = yield this.securityDeviceServices.createSessionServices(userId, ip, userAgent);
                return session;
            });
        }
        logoutServices(userId, refreshToken) {
            return __awaiter(this, void 0, void 0, function* () {
                const userToken = yield this.tokenService.validateRefreshToken(refreshToken);
                const session = yield this.securityDeviceServices.deleteSessionByDeviceIdServices(userId, userToken.deviceId);
                const isSaveRefreshTokenBlackList = yield this.tokenService.saveRefreshTokenBlackList(userId, refreshToken);
                if (session.acknowledged && isSaveRefreshTokenBlackList.acknowledged) {
                    return session.acknowledged;
                }
                else {
                    return utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST;
                }
            });
        }
        refreshTokenOrSessionService(ip, userAgent, userId, refreshToken) {
            return __awaiter(this, void 0, void 0, function* () {
                const isSessionExpired = (expirationDate) => {
                    const currentDate = new Date().toISOString();
                    return Number(expirationDate) < Number(currentDate);
                };
                const userToken = yield this.tokenService.validateRefreshToken(refreshToken);
                if (!userToken) {
                    return utils_1.INTERNAL_STATUS_CODE.REFRESH_TOKEN_VALIDATION_ERROR;
                }
                const device = yield this.securityDeviceServices._getSessionByDeviceIdServices(userToken.deviceId);
                if (!device) {
                    return utils_1.INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND;
                }
                // if(userAgent !== device){
                //     console.error('Нарушена безопасность: userAgent !== device !!! Это означает, что произошла смена устройства при обновлении токена!')
                // }
                const noExpSession = !isSessionExpired(device.expirationDate);
                // console.log('refreshTokenOrSessionService: - noExpSession', noExpSession)
                // console.log('refreshTokenOrSessionService: - device.lastActiveDate IF', device.lastActiveDate === new Date((userToken! as JwtPayload & { iat: number }).iat).toISOString())
                if (noExpSession && device.lastActiveDate === new Date(userToken.iat).toISOString()) {
                    const isSaveRefreshTokenBlackList = yield this.tokenService.saveRefreshTokenBlackList(userId, refreshToken);
                    if (isSaveRefreshTokenBlackList.acknowledged) {
                        const isUpdatedSession = yield this.securityDeviceServices.updateSessionServices(userId, ip, userAgent, String(userToken.deviceId));
                        if (isUpdatedSession) {
                            return isUpdatedSession;
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        return utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST;
                    }
                }
                else {
                    return utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN;
                }
            });
        }
        confirmEmail(code) {
            return __awaiter(this, void 0, void 0, function* () {
                let user = yield this.usersServices._findUserByConfirmationCode(code);
                if (!user)
                    return false;
                if (user.emailConfirmation.isConfirmed)
                    return false;
                if (user.emailConfirmation.confirmationCode !== code)
                    return false;
                const expirationDate = new Date(user.emailConfirmation.expirationDate);
                const currentDate = new Date();
                if (expirationDate < currentDate)
                    return false;
                return yield this.usersRepository.updateConfirmationUserRepository(user._id);
            });
        }
        emailResending(email) {
            return __awaiter(this, void 0, void 0, function* () {
                const confirmationCode = uuid.v4();
                const from = `IT-INCUBATOR <${process.env.SMTP_USER}>`;
                const to = email;
                const subject = `Повторный запрос на активацию аккаунта на сайте ${process.env.PROJEKT_NAME}`;
                const text = confirmationCode;
                const html = `
        <div>
            <h1>Для активации аккаунта на сайте ${process.env.PROJEKT_NAME} перейдите по ссылке!!!
            Если Вы не инициировали запрос на повторную активацию аккаунта на сайте ${process.env.PROJEKT_NAME}, 
            то немедленно заблокируйте эти попытки злоумышленников!</h1>
            <h2>${confirmationCode}</h2>
            <p>
                To finish registration please follow the link below:
                <a href="${process.env.API_URL}/auth/confirm-email?code=${confirmationCode}">Подтвердить регистрацию</a>
            </p>
            <button>
                <a href="${process.env.API_URL}/auth/confirm-email?code=${confirmationCode}">Подтвердить регистрацию</a>
            </button>
            <button>
                <a href="${process.env.API_URL}/auth/confirm-email?code=${confirmationCode}">Заблокировать</a>
            </button>
        </div>`;
                const getUser = yield this.usersServices._getUserByEmail(email);
                if (!getUser)
                    return null;
                if (getUser.emailConfirmation.isConfirmed)
                    return null;
                const isSend = this.mailService.sendMail(from, to, subject, text, html)
                    .catch(() => console.log('Ошибка отправки сообщения на E-Mail'));
                if (!isSend)
                    return null;
                return yield this.usersServices.updateResendingUserServices(String(getUser._id), confirmationCode);
            });
        }
        me(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const getUser = yield this.mongoDB.usersCollection.findOne({ _id: new mongodb_1.ObjectId(userId) });
                    if (getUser) {
                        const userInfo = this.usersQueryRepository._userMapForRender(getUser);
                        return {
                            email: userInfo.email,
                            login: userInfo.login,
                            userId: userInfo.id
                        };
                    }
                }
                catch (e) {
                    console.error(e);
                    return null;
                }
            });
        }
        _isAuthServiceForMiddleware(loginOrEmail, password) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield this.usersServices._getUserByLoginOrEmail(loginOrEmail);
                if (!user)
                    return null;
                // TODO Написать смс: Активируйте аккаунт!
                // if(!user.emailConfirmation.isConfirmed) return null
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.accountData.password);
                if (isPasswordValid) {
                    return { user };
                }
                else {
                    return null;
                }
            });
        }
    };
    __setFunctionName(_classThis, "AuthServices");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthServices = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthServices = _classThis;
})();
exports.AuthServices = AuthServices;
