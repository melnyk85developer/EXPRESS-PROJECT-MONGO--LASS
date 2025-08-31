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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.AuthServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const date_fns_1 = require("date-fns");
const uuid = __importStar(require("uuid"));
const mongodb_1 = require("mongodb");
const utils_1 = require("../../shared/utils/utils");
const emailAdapter_1 = require("../../shared/infrastructure/emailAdapter");
const inversify_1 = require("inversify");
const usersServices_1 = require("../users/usersServices");
const usersRepository_1 = require("../users/UserRpository/usersRepository");
const usersQueryRepository_1 = require("../users/UserRpository/usersQueryRepository");
const securityDeviceService_1 = require("../usersSessions/securityDeviceService");
const tokenService_1 = require("../../shared/infrastructure/tokenService");
const db_1 = require("../../db");
let AuthServices = class AuthServices {
    constructor(mongoDB, usersServices, usersRepository, usersQueryRepository, securityDeviceServices, tokenService, mailService) {
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
            // console.log('registrationServices - login, password, email 😡😡', login, password, email)
            const isLogin = yield this.usersServices._getUserByLoginOrEmailService(login);
            // console.log('registrationServices - isLogin: ', isLogin)
            const isEmail = yield this.usersServices._getUserByLoginOrEmailService(email);
            // console.log('registrationServices - isLogin, isEmail: ', isLogin, isEmail)
            if (!isLogin && !isEmail) {
                // console.log('😡 !isLogin && !isEmail)')
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
                // console.log('crestedUser: - 😡', crestedUser)
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
            let user = yield this.usersServices._findUserByConfirmationCodeService(code);
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
            const getUser = yield this.usersServices._getUserByEmailService(email);
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
            const user = yield this.usersServices._getUserByLoginOrEmailService(loginOrEmail);
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
exports.AuthServices = AuthServices;
exports.AuthServices = AuthServices = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(db_1.MongoDBCollection)),
    __param(1, (0, inversify_1.inject)(usersServices_1.UserService)),
    __param(2, (0, inversify_1.inject)(usersRepository_1.UsersRepository)),
    __param(3, (0, inversify_1.inject)(usersQueryRepository_1.UsersQueryRepository)),
    __param(4, (0, inversify_1.inject)(securityDeviceService_1.SecurityDeviceServices)),
    __param(5, (0, inversify_1.inject)(tokenService_1.TokenService)),
    __param(6, (0, inversify_1.inject)(emailAdapter_1.MailService)),
    __metadata("design:paramtypes", [db_1.MongoDBCollection,
        usersServices_1.UserService,
        usersRepository_1.UsersRepository,
        usersQueryRepository_1.UsersQueryRepository,
        securityDeviceService_1.SecurityDeviceServices,
        tokenService_1.TokenService,
        emailAdapter_1.MailService])
], AuthServices);
