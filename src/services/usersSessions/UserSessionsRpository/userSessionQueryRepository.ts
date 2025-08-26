import "reflect-metadata"
import { injectable } from "inversify";
import { SessionType, SessionTypeDB } from "../Sessions_DTO/sessionsType";
// import { devicesCollection } from "../../../db";
import { MongoDBCollection } from "../../../db";

@injectable()
export class UserSessionsQueryRepository {
    constructor(
        // @inject(TYPES.MongoDBCollection)
        private mongoDB: MongoDBCollection
    ) { }

    async getAllSessionByUserIdRepository(userId: string): Promise<any> {
        try {
            const devices = await this.mongoDB.devicesCollection.find({ userId }).toArray()
            // console.log('getAllSessionByUserIdRepository: - devices', devices)
            return this._arrUsersSessionMapForRender(devices)
        } catch (error) {
            console.error(error)
            return null
        }
    }
    async getSessionByIdQueryRepository(userId: string, deviceId: string): Promise<any> {
        // console.log('getSessionByIdQueryRepository: - userId', userId, 'deviceId: - ', deviceId)
        try {
            const device = await this.mongoDB.devicesCollection.findOne({ userId, deviceId }); // Ищем по userId и deviceId
            // console.log('getSessionByIdQueryRepository: device - ', device)
            const mapDevice = this._userSessionMapForRender(device)
            // console.log('getSessionByIdQueryRepository: mapDevice - ', mapDevice)
            return mapDevice
        } catch (error) {
            console.error(error);
            return { statusCode: -100, message: String(error) }
        }
    }
    _userSessionMapForRender(device: SessionTypeDB): SessionType {
        return {
            ip: device.ip,
            title: device.title,
            deviceId: device.deviceId,
            lastActiveDate: device.lastActiveDate
        }
    }
    _arrUsersSessionMapForRender(AllDevices: SessionTypeDB[]): SessionType[] {
        const Devices = [];
        for (let i = 0; i < AllDevices.length; i++) {
            let device = this._userSessionMapForRender(AllDevices[i]);
            Devices.push(device);
        }
        return Devices;
    }
}
