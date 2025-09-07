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
exports.AuthControllers = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../shared/utils/utils");
const ErRes_1 = require("../../shared/utils/ErRes");
const authServices_1 = require("./authServices");
const usersQueryRepository_1 = require("../users/UserRpository/usersQueryRepository");
const uuid = __importStar(require("uuid"));
const usersServices_1 = require("../users/usersServices");
const SuccessResponse_1 = require("../../shared/utils/SuccessResponse");
let AuthControllers = class AuthControllers {
    constructor(authServices, userService, usersQueryRepository) {
        this.authServices = authServices;
        this.userService = userService;
        this.usersQueryRepository = usersQueryRepository;
    }
    registrationController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('AuthControllers - data 😡 registrationController',
            //     req.body.login,
            //     req.body.password,
            //     req.body.email
            // )
            const result = yield this.authServices.registrationServices(req.body.login, req.body.password, req.body.email);
            // console.log('AuthControllers - registration: - result ', result)
            if (result.insertedId) {
                const foundUser = yield this.usersQueryRepository.getUserByIdRepository(result.insertedId);
                if (foundUser) {
                    return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.NO_CONTENT, undefined, undefined, undefined, res);
                }
            }
            else {
                throw new ErRes_1.ErRes(result, undefined, undefined, req, res);
            }
        });
    }
    loginController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            // console.log('authControllers: login - userId', String(req.user._id))
            let ip;
            let title;
            req.ip ? ip = req.ip : ip = `There's no ip address on the darknet`;
            req.headers['user-agent'] ? title = req.headers['user-agent'] : title = `device unknown='${uuid.v4()}'`;
            // @ts-ignore
            const result = yield this.authServices.loginServices(String(req.user._id), ip, title);
            // console.log('authControllers: result - ', result)
            if (result) {
                res
                    .cookie('refreshToken', result.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: true,
                })
                    .header('Authorization', `Bearer ${result.accessToken}`)
                    .status(utils_1.HTTP_STATUSES.OK_200)
                    .json({ "accessToken": result.accessToken });
            }
        });
    }
    logoutController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('authControllers: - logout', String(req.user!.id))
            const isLogout = yield this.authServices.logoutServices(String(req.user.id), req.cookies.refreshToken);
            if (isLogout) {
                res.clearCookie('refreshToken', { httpOnly: true });
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.NO_CONTENT, undefined, undefined, req, res);
            }
            else {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST, undefined, undefined, req, res);
            }
        });
    }
    refreshController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('authControllers: - refresh-token', String(req.user!.id))
            const isRefresh = yield this.authServices.refreshTokenOrSessionService(req.ip ? req.ip : `There's no ip address on the darknet`, req.headers['user-agent'] ? req.headers['user-agent'] : `device unknown='${uuid.v4()}'`, String(req.user.id), req.cookies['refreshToken']);
            if (isRefresh === utils_1.INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND) {
                // console.log('authControllers: - isRefresh', isRefresh)
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST, undefined, undefined, req, res);
            }
            if (isRefresh.refreshToken) {
                return res
                    .cookie('refreshToken', isRefresh.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: true,
                })
                    .status(utils_1.HTTP_STATUSES.OK_200)
                    .json({ "accessToken": isRefresh.accessToken });
            }
            else {
                return new ErRes_1.ErRes(isRefresh, undefined, undefined, req, res);
            }
        });
    }
    confirmationEmailController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authServices.confirmEmail(req.query.code);
            if (result) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED, undefined, undefined, req, res);
            }
            else {
                throw new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT, undefined, undefined, req, res);
            }
        });
    }
    registrationConfirmationController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authServices.confirmEmail(req.body.code);
            if (result) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED, undefined, undefined, req, res);
            }
            else {
                throw new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT, undefined, undefined, req, res);
            }
        });
    }
    registrationEmailResendingController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authServices.emailResending(req.body.email);
            if (result === null) {
                throw new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_USER_NOT_FOUND_OR_EMAIL_ALREADY_CONFIRMED, undefined, undefined, req, res);
            }
            if (result === false) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY, undefined, undefined, req, res);
            }
            return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.NO_CONTENT, undefined, undefined, req, res);
        });
    }
    passwordRecoveryController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('AuthControllers: - passwordRecoveryController req.body.email', req.body.email)
            const result = yield this.userService.ressetPasswordService(req.body.email);
            console.log('AuthControllers: - passwordRecoveryController result', result);
            if (result.status === utils_1.INTERNAL_STATUS_CODE.SUCCESS) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, `Сообщение успешно отправлено на E-Mail: ${req.params.email}. 
                Проверьте почту и следуйте дальнейшим инструкциям в письме. ${result.expirationDate}`, req, res);
            }
            else {
                throw new ErRes_1.ErRes(result.status, undefined, result.expirationDate, req, res);
            }
        });
    }
    newPasswordController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('AuthControllers - data 😡',
            //     req.body.login,
            //     req.body.password,
            //     req.body.email
            // )
            const { password, code } = req.body;
            if (password && code) {
                const isUpdate = yield this.userService.updatePasswordService(password, code);
                if (isUpdate) {
                    console.log('UsersController: - newPassword res', isUpdate);
                    return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS_UPDATED_PASSWORD, undefined, undefined, req, res);
                }
                else {
                    console.log('UsersController: updatePpassword - isUpdate - ', isUpdate);
                    throw new ErRes_1.ErRes(Number(isUpdate));
                }
            }
            else {
                throw new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_PASSWORD_CANT_BE_EMPTY, undefined, undefined, req, res);
            }
        });
    }
    meController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUser = yield this.authServices.me(String(req.user.id));
            if (authUser) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS, authUser, undefined, req, res);
            }
            else {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.USER_NOT_FOUND, undefined, undefined, req, res);
            }
        });
    }
};
exports.AuthControllers = AuthControllers;
exports.AuthControllers = AuthControllers = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(authServices_1.AuthServices)),
    __param(1, (0, inversify_1.inject)(usersServices_1.UserService)),
    __param(2, (0, inversify_1.inject)(usersQueryRepository_1.UsersQueryRepository)),
    __metadata("design:paramtypes", [authServices_1.AuthServices,
        usersServices_1.UserService,
        usersQueryRepository_1.UsersQueryRepository])
], AuthControllers);
