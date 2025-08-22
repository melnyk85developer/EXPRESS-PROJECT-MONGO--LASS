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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.authController = exports.AuthControllers = void 0;
const utils_1 = require("../../shared/utils/utils");
const authServices_1 = require("./authServices");
const usersQueryRepository_1 = require("../users/UserRpository/usersQueryRepository");
const ErResSwitch_1 = require("../../shared/utils/ErResSwitch");
const SuccessfulResponse_1 = require("../../shared/utils/SuccessfulResponse");
const uuid = __importStar(require("uuid"));
class AuthControllers {
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield authServices_1.authServices.registration(req.body.login, req.body.password, req.body.email);
            // console.log('result: - ', result)
            if (result.insertedId) {
                const foundUser = yield usersQueryRepository_1.usersQueryRepository.getUserByIdRepository(result.insertedId);
                if (foundUser) {
                    return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.NO_CONTENT);
                }
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, result);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            // console.log('authControllers: login - userId', String(req.user._id))
            let ip;
            let title;
            req.ip ? ip = req.ip : ip = `There's no ip address on the darknet`;
            req.headers['user-agent'] ? title = req.headers['user-agent'] : title = `device unknown='${uuid.v4()}'`;
            // @ts-ignore
            const result = yield authServices_1.authServices.loginServices(String(req.user._id), ip, title);
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
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('authControllers: - logout', String(req.user!.id))
            const isLogout = yield authServices_1.authServices.logoutServices(String(req.user.id), req.cookies.refreshToken);
            if (isLogout) {
                res.clearCookie('refreshToken', { httpOnly: true });
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.NO_CONTENT);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST);
            }
        });
    }
    refresh(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('authControllers: - refresh-token', String(req.user!.id))
            const isRefresh = yield authServices_1.authServices.refreshTokenOrSessionService(req.ip ? req.ip : `There's no ip address on the darknet`, req.headers['user-agent'] ? req.headers['user-agent'] : `device unknown='${uuid.v4()}'`, String(req.user.id), req.cookies['refreshToken']);
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
    confirmationEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield authServices_1.authServices.confirmEmail(req.query.code);
            if (result) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT);
            }
        });
    }
    registrationConfirmation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield authServices_1.authServices.confirmEmail(req.body.code);
            if (result) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT);
            }
        });
    }
    registrationEmailResending(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield authServices_1.authServices.emailResending(req.body.email);
            if (result === null) {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_USER_NOT_FOUND_OR_EMAIL_ALREADY_CONFIRMED);
            }
            if (result === false) {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY);
            }
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.NO_CONTENT);
        });
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUser = yield authServices_1.authServices.me(String(req.user.id));
            if (authUser) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, '', authUser);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.USER_NOT_FOUND);
            }
        });
    }
}
exports.AuthControllers = AuthControllers;
exports.authController = new AuthControllers();
