"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.SecurityController = void 0;
const ErRes_1 = require("../../shared/utils/ErRes");
const utils_1 = require("../../shared/utils/utils");
const inversify_1 = require("inversify");
const securityDeviceService_1 = require("./securityDeviceService");
const userSessionQueryRepository_1 = require("./UserSessionsRpository/userSessionQueryRepository");
const SuccessResponse_1 = require("../../shared/utils/SuccessResponse");
let SecurityController = class SecurityController {
    constructor(securityDeviceServices, userSessionsQueryRepository) {
        this.securityDeviceServices = securityDeviceServices;
        this.userSessionsQueryRepository = userSessionsQueryRepository;
        this.getAllSessionsByUserId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const sessions = yield this.userSessionsQueryRepository.getAllSessionByUserIdRepository(String(req.user.id));
            return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_SESSIONS, sessions, undefined, req, res);
        });
        this.deleteAllSessions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const isDeleteSessions = yield this.securityDeviceServices.deleteAllSessionsServices(String(req.user.id), req.deviceId);
            if (isDeleteSessions.acknowledged === true) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS, undefined, undefined, req, res);
            }
            return new ErRes_1.ErRes(isDeleteSessions.statusCode, undefined, isDeleteSessions.message, req, res);
        });
        this.deleteSessionByDeviceId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const isDeleteSession = yield this.securityDeviceServices.deleteSessionByDeviceIdServices(String(req.user.id), req.params.deviceId);
            if (isDeleteSession.acknowledged) {
                res.clearCookie('refreshToken', { httpOnly: true });
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS_BY_DEVICE_ID, undefined, undefined, req, res);
            }
            return new ErRes_1.ErRes(isDeleteSession.statusCode, undefined, isDeleteSession.message, req, res);
        });
    }
};
exports.SecurityController = SecurityController;
exports.SecurityController = SecurityController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(securityDeviceService_1.SecurityDeviceServices)),
    __param(1, (0, inversify_1.inject)(userSessionQueryRepository_1.UserSessionsQueryRepository)),
    __metadata("design:paramtypes", [securityDeviceService_1.SecurityDeviceServices,
        userSessionQueryRepository_1.UserSessionsQueryRepository])
], SecurityController);
