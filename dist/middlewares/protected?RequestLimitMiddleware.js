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
exports.protectedRequestLimitMiddleware = void 0;
const moment_1 = __importDefault(require("moment"));
const db_1 = require("../db");
const ErResSwitch_1 = require("../utils/ErResSwitch");
const utils_1 = require("../utils/utils");
const settings_1 = require("../settings");
const protectedRequestLimitMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // if(process.env.NODE_ENV === 'test'){
    //     next();
    //     return 
    // }
    if (!req.user.id) {
        console.log('protectedRequestLimitMiddleware: - ', req.user.id);
        next();
        return;
    }
    else {
        const request = {
            IP: req.ip,
            URL: req.originalUrl,
            date: new Date()
        };
        const timeWindow = settings_1.SETTINGS.PROTECTED_TIME_WINDOW || 10000; // Интервал времени в миллисекундах
        const maxRequests = settings_1.SETTINGS.PROTECTED_MAX_REQUESTS || 10; // Максимальное количество запросов
        const timeAgo = (0, moment_1.default)(request.date).subtract(timeWindow, 'milliseconds').toDate();
        try {
            const requestFilter = {
                IP: request.IP,
                URL: request.URL,
                date: { $gte: timeAgo }
            };
            const count = yield db_1.requestsCollection.countDocuments(requestFilter);
            if (count >= Number(maxRequests)) {
                console.log(`Превышен лимит запросов в protectedRequestLimitMiddleware для userId: ${request.IP}, URL: ${request.URL}, запросов: ${count}`);
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_TOO_MANY_REQUESTS);
            }
            yield db_1.requestsCollection.insertOne(request);
            // console.log('Запрос сохранен в базу:', requestData);
        }
        catch (error) {
            console.error('Ошибка в protectedRequestLimitMiddleware:', error);
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST, 'Что-то пошло не так при сохранении сессии в базу данных!');
        }
    }
});
exports.protectedRequestLimitMiddleware = protectedRequestLimitMiddleware;
