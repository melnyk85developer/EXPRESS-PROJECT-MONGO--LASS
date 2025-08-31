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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalRequestLimitMiddleware = void 0;
const moment_1 = __importDefault(require("moment"));
const settings_1 = require("../settings");
const ErResSwitch_1 = require("../utils/ErResSwitch");
const utils_1 = require("../utils/utils");
const inversify_1 = require("inversify");
const tokenService_1 = require("../infrastructure/tokenService");
// import { requestsCollection } from "../../db";
const db_1 = require("../../db");
let GlobalRequestLimitMiddleware = class GlobalRequestLimitMiddleware {
    constructor(tokenService, mongoDB) {
        this.tokenService = tokenService;
        this.mongoDB = mongoDB;
        this.globalRequestLimitMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (process.env.NODE_ENV === 'test') {
                next();
                return;
            }
            if (req.cookies['refreshToken']) {
                const userToken = yield this.tokenService.validateRefreshToken(req.cookies['refreshToken']);
                if (String(userToken.userId)) {
                    // console.log('globalRequestLimitMiddleware: - ', String((userToken as JwtPayload).userId))
                    next();
                    return;
                }
            }
            else {
                const request = {
                    IP: req.ip,
                    URL: req.originalUrl,
                    date: new Date()
                };
                const tenSecondsAgo = (0, moment_1.default)(request.date).subtract(settings_1.SETTINGS.TIME_WINDOW, 'milliseconds').toDate();
                try {
                    const filter = {
                        IP: req.ip,
                        URL: req.originalUrl,
                        date: { $gte: tenSecondsAgo }
                    };
                    const count = yield this.mongoDB.requestsCollection.countDocuments(filter);
                    if (count >= Number(settings_1.SETTINGS.MAX_REQUESTS)) {
                        console.log(`IP: ${request.IP}, URL: ${request.URL}, запросов: ${count}`);
                        console.log(`Превышен лимит скорости в globalRequestLimitMiddleware для IP: ${request.IP}, URL: ${request.URL}`);
                        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_TOO_MANY_REQUESTS);
                    }
                    const result = yield this.mongoDB.requestsCollection.insertOne(request);
                    // console.log('Сохранено в базу данных:', result);
                }
                catch (error) {
                    console.error('Ошибка в globalRequestLimitMiddleware:', error);
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST, 'Что-то пошло не так при сохранении сессии в базу данных!');
                }
                return next();
            }
        });
    }
};
exports.GlobalRequestLimitMiddleware = GlobalRequestLimitMiddleware;
exports.GlobalRequestLimitMiddleware = GlobalRequestLimitMiddleware = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(tokenService_1.TokenService)),
    __param(1, (0, inversify_1.inject)(db_1.MongoDBCollection)),
    __metadata("design:paramtypes", [tokenService_1.TokenService,
        db_1.MongoDBCollection])
], GlobalRequestLimitMiddleware);
