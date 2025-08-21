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
exports.userSessionsQueryRepository = void 0;
const db_1 = require("../../../db");
exports.userSessionsQueryRepository = {
    getAllSessionByUserIdRepository(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const devices = yield db_1.devicesCollection.find({ userId }).toArray();
                // console.log('getAllSessionByUserIdRepository: - devices', devices)
                return this._arrUsersSessionMapForRender(devices);
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    },
    getSessionByIdQueryRepository(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('getSessionByIdQueryRepository: - userId', userId, 'deviceId: - ', deviceId)
            try {
                const device = yield db_1.devicesCollection.findOne({ userId, deviceId }); // Ищем по userId и deviceId
                // console.log('getSessionByIdQueryRepository: device - ', device)
                const mapDevice = this._userSessionMapForRender(device);
                // console.log('getSessionByIdQueryRepository: mapDevice - ', mapDevice)
                return mapDevice;
            }
            catch (error) {
                console.error(error);
                return { statusCode: -100, message: String(error) };
            }
        });
    },
    _userSessionMapForRender(device) {
        return {
            ip: device.ip,
            title: device.title,
            deviceId: device.deviceId,
            lastActiveDate: device.lastActiveDate
        };
    },
    _arrUsersSessionMapForRender(AllDevices) {
        const Devices = [];
        for (let i = 0; i < AllDevices.length; i++) {
            let device = this._userSessionMapForRender(AllDevices[i]);
            Devices.push(device);
        }
        return Devices;
    },
};
