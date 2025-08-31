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
const ErResSwitch_1 = require("../../shared/utils/ErResSwitch");
const SuccessfulResponse_1 = require("../../shared/utils/SuccessfulResponse");
const authServices_1 = require("./authServices");
const usersQueryRepository_1 = require("../users/UserRpository/usersQueryRepository");
const uuid = __importStar(require("uuid"));
let AuthControllers = class AuthControllers {
    constructor(authServices, usersQueryRepository) {
        this.authServices = authServices;
        this.usersQueryRepository = usersQueryRepository;
    }
    registrationController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('AuthControllers - data 😡', req.body.login, req.body.password, req.body.email);
            const result = yield this.authServices.registrationServices(req.body.login, req.body.password, req.body.email);
            console.log('AuthControllers - registration: - result ', result);
            if (result.insertedId) {
                const foundUser = yield this.usersQueryRepository.getUserByIdRepository(result.insertedId);
                if (foundUser) {
                    return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.NO_CONTENT);
                }
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, result);
            }
        });
    }
    loginControllers(req, res) {
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
    logoutControllers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('authControllers: - logout', String(req.user!.id))
            const isLogout = yield this.authServices.logoutServices(String(req.user.id), req.cookies.refreshToken);
            if (isLogout) {
                res.clearCookie('refreshToken', { httpOnly: true });
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.NO_CONTENT);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST);
            }
        });
    }
    refreshControllers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('authControllers: - refresh-token', String(req.user!.id))
            const isRefresh = yield this.authServices.refreshTokenOrSessionService(req.ip ? req.ip : `There's no ip address on the darknet`, req.headers['user-agent'] ? req.headers['user-agent'] : `device unknown='${uuid.v4()}'`, String(req.user.id), req.cookies['refreshToken']);
            if (isRefresh === utils_1.INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND) {
                // console.log('authControllers: - isRefresh', isRefresh)
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST);
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
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, isRefresh);
            }
        });
    }
    confirmationEmailControllers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authServices.confirmEmail(req.query.code);
            if (result) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT);
            }
        });
    }
    registrationConfirmationControllers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authServices.confirmEmail(req.body.code);
            if (result) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT);
            }
        });
    }
    registrationEmailResendingControllers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authServices.emailResending(req.body.email);
            if (result === null) {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_USER_NOT_FOUND_OR_EMAIL_ALREADY_CONFIRMED);
            }
            if (result === false) {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY);
            }
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.NO_CONTENT);
        });
    }
    meControllers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUser = yield this.authServices.me(String(req.user.id));
            if (authUser) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, '', authUser);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.USER_NOT_FOUND);
            }
        });
    }
};
exports.AuthControllers = AuthControllers;
exports.AuthControllers = AuthControllers = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(authServices_1.AuthServices)),
    __param(1, (0, inversify_1.inject)(usersQueryRepository_1.UsersQueryRepository)),
    __metadata("design:paramtypes", [authServices_1.AuthServices,
        usersQueryRepository_1.UsersQueryRepository])
], AuthControllers);
