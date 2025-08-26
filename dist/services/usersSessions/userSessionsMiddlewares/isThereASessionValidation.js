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
exports.SessionsMiddlewares = void 0;
require("reflect-metadata");
const utils_1 = require("../../../shared/utils/utils");
const ErResSwitch_1 = require("../../../shared/utils/ErResSwitch");
const inversify_1 = require("inversify");
const userSessionsRepository_1 = require("../UserSessionsRpository/userSessionsRepository");
const tokenService_1 = require("../../../shared/infrastructure/tokenService");
let SessionsMiddlewares = class SessionsMiddlewares {
    constructor(
    // @inject(TYPES.UserSessionsRepository)
    userSessionsRepository, 
    // @inject(TYPES.TokenService)
    tokenService) {
        this.userSessionsRepository = userSessionsRepository;
        this.tokenService = tokenService;
        this.deviceIdMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // console.log('deviceIdMiddleware: - ', req.params.deviceId, req.user!.id)
            const cookieName = 'refreshToken';
            const refreshToken = req.cookies[cookieName];
            const userToken = yield this.tokenService.validateRefreshToken(refreshToken);
            // console.log('deviceIdMiddleware: userToken - ', userToken)
            const foundDevice = yield this.userSessionsRepository._getSessionDeviceByIdRepository(String(req.params.deviceId));
            // console.log('deviceIdMiddleware: - foundDevice', foundDevice)
            if (!foundDevice) {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND);
            }
            if (String(userToken.userId) !== String(foundDevice.userId)) {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_SESSION);
            }
            const foundSession = yield this.userSessionsRepository._getSessionByUserIdRepository(String(req.user.id), String(req.params.deviceId));
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
    }
};
exports.SessionsMiddlewares = SessionsMiddlewares;
exports.SessionsMiddlewares = SessionsMiddlewares = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [userSessionsRepository_1.UserSessionsRepository,
        tokenService_1.TokenService])
], SessionsMiddlewares);
