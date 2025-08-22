import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { devicesCollection, usersCollection } from "../../../db";
import { add } from "date-fns";
import { SessionType } from "../Sessions_DTO/sessionsType";

export class UserSessionsRepository {
    async createSessionsRepository(session: SessionType): Promise<InsertOneResult<{ acknowledged: boolean, insertedId: number }> | any> {
        try {
            return await devicesCollection.insertOne(session)
        } catch (error) {
            console.error(error)
            return null
        }
    }
    async updateSessionsRepository(session: SessionType): Promise<UpdateResult | null> {
        try {
            const isUpdateSessionRepository = await devicesCollection.updateOne(
                { deviceId: session.deviceId },
                { $set: session } // Используем $set для обновления полей
            );
            // console.log('isUpdateSessionRepository: - ', isUpdateSessionRepository);
            return isUpdateSessionRepository;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    async deleteSessionsByDeviceIdRepository(userId: string, deviceId: string): Promise<DeleteResult | null> {
        try {
            const isDeleted = await devicesCollection.deleteOne({ userId, deviceId })
            // console.log('deleteSessionsByDeviceIdRepository: - isDeleted', isDeleted)
            return isDeleted
        } catch (error) {
            console.error(error)
            return null
        }
    }
    async deleteAllSessionsRepository(userId: string, deviceId: string): Promise<{ statusCode: number, message: string } | any> {
        // console.log('deleteAllSessionsRepository: - userId & deviceId', userId, deviceId)
        try {
            return await devicesCollection.deleteMany({
                userId,
                deviceId: { $ne: deviceId } // Удаляем все, где deviceId НЕ равно переданному
            });
        } catch (error) {
            console.error(error)
            return { statusCode: -100, message: String(error) }
        }
    }
    async _getAllSessionyUsersRepository(): Promise<any> {
        try {
            return await devicesCollection.find().toArray();
        } catch (error) {
            console.error(error)
            return null
        }
    }
    async _getAllSessionByUserIdRepository(userId: string): Promise<any> {
        try {
            return await devicesCollection.find({ userId }).toArray();
        } catch (error) {
            console.error(error);
            return error;
        }
    }
    async _getSessionByUserIdRepository(userId: string, deviceId: string): Promise<any> {
        try {
            const session = await devicesCollection.findOne({ userId, deviceId });
            // console.log('_getSessionByUserIdRepository session: - ', session)
            return session
        } catch (error) {
            console.error(error)
            return null
        }
    }
    async _getSessionDeviceByIdRepository(deviceId: string): Promise<{ statusCode: number, message: string } | string> {
        try {
            const device = await devicesCollection.findOne({ deviceId }); // Ищем по deviceId
            // console.log('_getSessionDeviceByIdRepository: - device', device)
            return device
        } catch (error) {
            console.error(error);
            return { statusCode: -100, message: String(error) }
        }
    }
}
export const userSessionsRepository = new UserSessionsRepository()