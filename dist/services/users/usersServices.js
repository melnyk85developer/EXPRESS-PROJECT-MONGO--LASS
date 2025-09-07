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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const uuid = __importStar(require("uuid"));
const mongodb_1 = require("mongodb");
const userTypes_1 = require("./Users_DTO/userTypes");
const inversify_1 = require("inversify");
const usersRepository_1 = require("./UserRpository/usersRepository");
const utils_1 = require("../../shared/utils/utils");
const confirmationRepository_1 = require("../confirmation/confirmationRepository/confirmationRepository");
const date_fns_1 = require("date-fns");
const resetPasswordEmailMessage_HTML_1 = require("../../shared/infrastructure/resetPasswordEmailMessage.HTML");
const emailAdapter_1 = require("../../shared/infrastructure/emailAdapter");
let UserService = class UserService {
    constructor(usersRepository, mailService, myConfirmationRepository) {
        this.usersRepository = usersRepository;
        this.mailService = mailService;
        this.myConfirmationRepository = myConfirmationRepository;
    }
    createUserServices(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accountData, confirmations } = user;
            if (accountData.userName && accountData.password && accountData.email) {
                let createUser = new userTypes_1.UserTypeDB(new mongodb_1.ObjectId(), {
                    userName: accountData.userName,
                    email: accountData.email,
                    password: yield bcrypt.hash(accountData.password, 10),
                    createdAt: accountData.createdAt
                });
                return yield this.usersRepository.createUserRepository(createUser);
            }
        });
    }
    updateUserServices(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = {
                login: body.login,
                email: body.email
            };
            return yield this.usersRepository.updateUserRepository(id, updatedUser);
        });
    }
    updateResendingUserServices(id, confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersRepository.updateResendingUserRepository(id, confirmationCode);
        });
    }
    deleteUserServices(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersRepository.deleteUserRepository(id);
        });
    }
    ressetPasswordService(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('UserService: - ressetPasswordService email', email)
            const confirmationCode = uuid.v4();
            const user = yield this._getUserByEmailService(email);
            if (user && user._id) {
                // console.log('UserService: - ressetPasswordService user', user)
                const confirmPassword = user.confirmations.filter((i) => i.field === 'password');
                if (user.confirmations.length > 0 && confirmPassword) {
                    console.log('UserService: - ressetPasswordService confirmPassword', confirmPassword);
                    if (confirmPassword) {
                        let block = user.confirmations.filter((i) => i.isBlocked === true && i.field === 'password');
                        if (block.length) {
                            console.log('ressetPasswordService blocked length: ', block.length);
                            for (let i = 0; block.length > i; i++) {
                                const confirmation = user.confirmations[i];
                                if (new Date < confirmation.expirationDate && block[i].field === 'password' && block[i].isBlocked === true) {
                                    console.log('UsersService ressetPasswordService: - Блокировка не пустила - время не прошло в сбросе пароля!', confirmation.expirationDate);
                                    return {
                                        status: utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_FUNCTION_BLOCKED,
                                        expirationDate: confirmation.expirationDate.toISOString()
                                    };
                                }
                                else {
                                    const confirmation = user.confirmations[i];
                                    if (new Date > confirmation.expirationDate && user.confirmations[i].field === 'password') {
                                        console.log('UsersService ressetPasswordService: - Блокировку удаляем - время закончилось в сбросе пароля!', confirmation.expirationDate);
                                        const deleteBlock = block[i];
                                        yield this.myConfirmationRepository.deleteConfirmationIdRepository(deleteBlock.id);
                                    }
                                }
                            }
                        }
                        const confirmations = user.confirmations.filter((c) => c.field === 'password' && c.isBlocked === false);
                        if (confirmations && confirmations.length > 0) {
                            console.log('ressetPasswordService: - confirmations', user.confirmations);
                            for (let i = 0; confirmations.length > i; i++) {
                                if (new Date < confirmations[i].expirationDate) {
                                    console.log('UsersService ressetPasswordService: - 3 минуты не прошло!', confirmations[i].expirationDate);
                                    return {
                                        status: utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_TIME_HASNT_PASSED_YET,
                                        expirationDate: confirmations[i].expirationDate.toISOString()
                                    };
                                }
                            }
                        }
                        console.log('confirmations.length : - ', confirmations);
                        if (confirmPassword.length > 3) {
                            console.log('UsersService ressetPasswordService: - Блокировка сброса пароля - при частых отправках сообщения на E-Mail', user.confirmation.length);
                            const confirTime = confirmPassword.filter((i) => {
                                const expirationDate = new Date(i.expirationDate).getTime();
                                const fifteenMinutesAgo = Date.now() - 18 * 60 * 1000; // 18 минут назад
                                return expirationDate > fifteenMinutesAgo; // проверка, что время не прошло 18 минут
                            });
                            console.log('UsersService ressetPasswordService: - confirTime.length', confirTime.length);
                            // Если за последние 18 минут было более 5 запросов, блокируем
                            if (confirTime.length >= 5 && confirmPassword[confirmPassword.length - 1].isBlocked === false) {
                                console.log('UsersService ressetPasswordService: - Блокировка Resset password!', confirTime.length);
                                const clearConfir = user.confirmations.filter((i) => i.isBlocked === false && i.field === 'password');
                                for (let i = 0; clearConfir.length > i; i++) {
                                    yield this.myConfirmationRepository.deleteConfirmationIdRepository(clearConfir[i].id);
                                }
                                const expirationDate = yield this.myConfirmationRepository.createConfirmationRepository({
                                    confirmationCode: confirmationCode,
                                    expirationDate: (0, date_fns_1.add)(new Date(), {
                                        minutes: 40
                                    }),
                                    isBlocked: true,
                                    field: 'password',
                                    userId: user._id,
                                });
                                return {
                                    status: utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_A_LOT_OF_REQUESTS_TRY_AGAIN_LATER,
                                    expirationDate: expirationDate.expirationDate.toISOString()
                                };
                            }
                        }
                        console.log('confirmations: - ', confirmations);
                    }
                }
                const nameProjekt = `<span style="margin: -2px 0 0 0; color: #FEA930; font-size: 18px;">Web</span><span style="margin: -2px 0 0 0; color: #15c; font-size: 18px;">Mars</span>`;
                const from = `${process.env.PROJEKT_NAME}<${process.env.SMTP_USER}>`;
                const to = email;
                const subject = `Сброс пароля на проекте ${process.env.PROJEKT_NAME}`;
                const text = confirmationCode;
                const html = (0, resetPasswordEmailMessage_HTML_1.resetPasswordEmailMessageHTMLDocument)(nameProjekt, to, text, `${process.env.CLIENT_URL}/newpassword?code=${confirmationCode}`, user);
                const isSendEmail = this.mailService.sendMail(from, to, subject, text, html)
                    .catch(() => console.log(`
                Упс, что-то пошло не так во время отправки сообщения на E-Mail: ${email}. Возможно сервис отправки 
                писем перегружен, просим Вас повторить запрос чуть позже.`));
                const expirationDate = yield this.myConfirmationRepository.createConfirmationRepository({
                    confirmationCode: confirmationCode,
                    expirationDate: (0, date_fns_1.add)(new Date(), {
                        minutes: 3
                    }),
                    isBlocked: false,
                    field: 'password',
                    userId: user._id,
                });
                // console.log('UsersService ressetPasswordService: - expirationDate', expirationDate)
                if (expirationDate && expirationDate.acknowledged) {
                    const confirmation = yield this.myConfirmationRepository.findConfirmationByIdRepository(expirationDate.insertedId);
                    if (!confirmation) {
                        return null;
                    }
                    // console.log('UsersService ressetPasswordService: - expirationDate res 200', expirationDate)
                    console.log('UsersService ressetPasswordService: - confirmation res 200', confirmation);
                    return {
                        status: utils_1.INTERNAL_STATUS_CODE.SUCCESS,
                        expirationDate: confirmation.expirationDate.toISOString()
                    };
                    // throw new ErRes(INTERNAL_STATUS_CODE.SUCCESS, expirationDate.expirationDate.toISOString())
                }
                else {
                    console.log('UNPROCESSABLE_ENTITY: - isSendEmail', isSendEmail);
                    return utils_1.INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY;
                }
            }
            else if (user === utils_1.INTERNAL_STATUS_CODE.USER_NOT_FOUND) {
                return { status: utils_1.INTERNAL_STATUS_CODE.USER_NOT_FOUND, expirationDate: '' };
            }
            else {
                return { status: utils_1.INTERNAL_STATUS_CODE.NOT_FOUND, expirationDate: '' };
            }
        });
    }
    updatePasswordService(password, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashPassword = yield bcrypt.hash(password, 10);
            const passwordConfirmationByCode = yield this.myConfirmationRepository.findByCodeConfirmationRepository(code);
            if (passwordConfirmationByCode) {
                // console.log('updatePasswordService: - passwordConfirmationByCode', passwordConfirmationByCode)
                const isUser = yield this._getUserByIdService(passwordConfirmationByCode.userId);
                if (isUser && isUser.confirmations.length) {
                    const confirmations = isUser.confirmations[isUser.confirmation.length - 1];
                    if (new Date > confirmations.expirationDate) {
                        // console.log('UsersService confirmationCode: - Код протух: ', confirmation.expirationDate)
                        return utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_EXPIRATION_TIME_PASSED;
                    }
                    else {
                        return yield this.usersRepository.updatePasswordRepository(hashPassword, isUser.userId);
                    }
                }
                else {
                    return utils_1.INTERNAL_STATUS_CODE.NOT_FOUND;
                }
            }
            else {
                return utils_1.INTERNAL_STATUS_CODE.NOT_FOUND;
            }
        });
    }
    _getUserByIdService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersRepository._getUserByIdRepository(id);
        });
    }
    _getUserByLoginOrEmailService(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('UserService - loginOrEmail 😡😡', loginOrEmail)
            return yield this.usersRepository._getUserByLoginOrEmailRepository(loginOrEmail);
        });
    }
    _getUserByEmailService(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository._getUserByEmailRepository(email);
            if (!user) {
                return utils_1.INTERNAL_STATUS_CODE.USER_NOT_FOUND;
            }
            // console.log('UserService: - _getUserByEmailService user', user)
            const confirmations = yield this.myConfirmationRepository.findByUserIdConfirmationRepository(user._id);
            if (!confirmations) {
                return null;
            }
            // console.log('UserService: - _getUserByEmailService confirmations', confirmations)
            return Object.assign(Object.assign({}, user), { confirmations });
        });
    }
    _findUserByConfirmationCodeService(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersRepository._findUserByConfirmationCodeRepository(code);
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(usersRepository_1.UsersRepository)),
    __param(1, (0, inversify_1.inject)(emailAdapter_1.MailService)),
    __param(2, (0, inversify_1.inject)(confirmationRepository_1.ConfirmationRepository)),
    __metadata("design:paramtypes", [usersRepository_1.UsersRepository,
        emailAdapter_1.MailService,
        confirmationRepository_1.ConfirmationRepository])
], UserService);
