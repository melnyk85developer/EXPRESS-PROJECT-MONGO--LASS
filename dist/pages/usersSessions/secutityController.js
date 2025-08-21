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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secutityControllers = void 0;
const express_1 = __importDefault(require("express"));
const authGuardMiddleware_1 = require("../auth/AuthMiddlewares/authGuardMiddleware");
const ErResSwitch_1 = require("../../utils/ErResSwitch");
const utils_1 = require("../../utils/utils");
const SuccessfulResponse_1 = require("../../utils/SuccessfulResponse");
const secutityDeviceService_1 = require("./secutityDeviceService");
const isThereASessionValidation_1 = require("./userSessionsMiddlewares/isThereASessionValidation");
const userSessionQueryRepository_1 = require("./UserSessionsRpository/userSessionQueryRepository");
const secutityControllers = () => {
    const router = express_1.default.Router();
    router.get(`/devices`, 
    // accessTokenMiddleware,
    authGuardMiddleware_1.refreshTokenMiddleware, authGuardMiddleware_1.sessionTokenMiddleware, 
    // protectedRequestLimitMiddleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        // console.log('secutityControllers: - getAlldevices', String(req.user!.id), req.deviceId)
        const sessions = yield userSessionQueryRepository_1.userSessionsQueryRepository.getAllSessionByUserIdRepository(String(req.user.id));
        // console.log('secutityControllers: - sessions', sessions)
        return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_SESSIONS, undefined, sessions);
    }));
    router.delete(`/devices`, 
    // accessTokenMiddleware,
    authGuardMiddleware_1.refreshTokenMiddleware, authGuardMiddleware_1.sessionTokenMiddleware, 
    // protectedRequestLimitMiddleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        const isDeleteSessions = yield secutityDeviceService_1.secutityDeviceServices.deleteAllSessionsServices(String(req.user.id), req.deviceId);
        if (isDeleteSessions.acknowledged === true) {
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS);
        }
        else {
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, isDeleteSessions.statusCode, isDeleteSessions.message);
        }
    }));
    router.delete(`/devices/:deviceId`, 
    // accessTokenMiddleware,
    authGuardMiddleware_1.refreshTokenMiddleware, authGuardMiddleware_1.sessionTokenMiddleware, isThereASessionValidation_1.deviceIdMiddleware, 
    // protectedRequestLimitMiddleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const isDeleteSession = yield secutityDeviceService_1.secutityDeviceServices.deleteSessionByDeviceIdServices(
        // @ts-ignore
        String(req.user.id), req.params.deviceId);
        if (isDeleteSession.acknowledged) {
            res.clearCookie('refreshToken', { httpOnly: true });
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS_BY_DEVICE_ID);
        }
        else {
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, isDeleteSession.statusCode, isDeleteSession.message);
        }
    }));
    // router.get(`/devices-all`, 
    //     accessTokenMiddleware,
    //     sessionTokenMiddleware,
    //     async (req: Request, res: Response) => {
    //     const sessions = await userSessionsRepository._getAllSessionyUsersRepository()
    //     return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_CREATED_SESSIONS, undefined, sessions)
    // });
    return router;
};
exports.secutityControllers = secutityControllers;
