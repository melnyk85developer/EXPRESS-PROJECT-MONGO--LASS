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
exports.deviceIdMiddleware = void 0;
const utils_1 = require("../../../shared/utils/utils");
const ErResSwitch_1 = require("../../../shared/utils/ErResSwitch");
const userSessionsRepository_1 = require("../UserSessionsRpository/userSessionsRepository");
const tokenService_1 = require("../../../shared/infrastructure/tokenService");
const deviceIdMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('deviceIdMiddleware: - ', req.params.deviceId, req.user!.id)
    const cookieName = 'refreshToken';
    const refreshToken = req.cookies[cookieName];
    const userToken = yield tokenService_1.tokenService.validateRefreshToken(refreshToken);
    // console.log('deviceIdMiddleware: userToken - ', userToken)
    const foundDevice = yield userSessionsRepository_1.userSessionsRepository._getSessionDeviceByIdRepository(String(req.params.deviceId));
    // console.log('deviceIdMiddleware: - foundDevice', foundDevice)
    if (!foundDevice) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND);
    }
    if (String(userToken.userId) !== String(foundDevice.userId)) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_SESSION);
    }
    const foundSession = yield userSessionsRepository_1.userSessionsRepository._getSessionByUserIdRepository(String(req.user.id), String(req.params.deviceId));
    if (foundSession) {
        if (!foundSession) {
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND);
        }
    }
    else {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND);
    }
    return next();
});
exports.deviceIdMiddleware = deviceIdMiddleware;
