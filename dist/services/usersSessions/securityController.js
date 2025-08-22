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
exports.securityController = exports.SecurityController = void 0;
const ErResSwitch_1 = require("../../shared/utils/ErResSwitch");
const utils_1 = require("../../shared/utils/utils");
const SuccessfulResponse_1 = require("../../shared/utils/SuccessfulResponse");
const securityDeviceService_1 = require("./securityDeviceService");
const userSessionQueryRepository_1 = require("./UserSessionsRpository/userSessionQueryRepository");
class SecurityController {
    constructor() {
        this.getAllSessionsByUserId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const sessions = yield userSessionQueryRepository_1.userSessionsQueryRepository.getAllSessionByUserIdRepository(String(req.user.id));
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_SESSIONS, undefined, sessions);
        });
        this.deleteAllSessions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const isDeleteSessions = yield securityDeviceService_1.securityDeviceServices.deleteAllSessionsServices(String(req.user.id), req.deviceId);
            if (isDeleteSessions.acknowledged === true) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS);
            }
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, isDeleteSessions.statusCode, isDeleteSessions.message);
        });
        this.deleteSessionByDeviceId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const isDeleteSession = yield securityDeviceService_1.securityDeviceServices.deleteSessionByDeviceIdServices(String(req.user.id), req.params.deviceId);
            if (isDeleteSession.acknowledged) {
                res.clearCookie('refreshToken', { httpOnly: true });
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS_BY_DEVICE_ID);
            }
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, isDeleteSession.statusCode, isDeleteSession.message);
        });
    }
}
exports.SecurityController = SecurityController;
exports.securityController = new SecurityController();
