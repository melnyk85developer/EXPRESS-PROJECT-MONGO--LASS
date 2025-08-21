import { DeleteResult, InsertOneResult, UpdateResult } from "mongodb";
import { userSessionsRepository } from "./UserSessionsRpository/userSessionsRepository";
import { ResErrorsSwitch } from "../../utils/ErResSwitch";
import { INTERNAL_STATUS_CODE } from "../../utils/utils";
import * as uuid from 'uuid';
import { add } from "date-fns";
import { SessionType } from "./Sessions_DTO/sessionsType";
import { tokenService } from "../../infrastructure/tokenService";
import { JwtPayload } from "jsonwebtoken";

export const secutityDeviceServices = {
    async createSessionServices(userId: string, ip: string, userAgent: string): Promise<{ accessToken: string, refreshToken: string } | any> {
        const allUserSessions = await secutityDeviceServices._getAllSessionByUserIdServices(userId);
        const existingSession = allUserSessions.find(
            (session: { title: string; }) => session.title === userAgent
        );
        if(existingSession){
            // Обновляем существующую сессию
            console.log('secutityDeviceServices: - Обновляем существующую сессию', existingSession)
            return await this.updateSessionServices(
                userId, 
                ip, 
                userAgent, 
                existingSession.deviceId
            )
        }else{
            // Создаём новую сессию
            const deviceId = uuid.v4();
            const { accessToken, refreshToken } = await tokenService.generateTokens(userId, deviceId);
    
            if (!accessToken || !refreshToken) {
                return INTERNAL_STATUS_CODE.UNAUTHORIZED_TOKEN_CREATION_ERROR;
            }
            const userToken = await tokenService.validateRefreshToken(refreshToken);

            const session = {
                ip,
                title: userAgent,
                userId,
                deviceId,
                lastActiveDate: new Date((userToken! as JwtPayload & { iat: number }).iat).toISOString(),
                expirationDate: new Date((userToken! as JwtPayload & { exp: number }).exp).toISOString(),
                // expirationDate: add(new Date(), {
                //     days: 1 ,
                //     hours: 0,
                //     minutes: 0
                // }),
            };
            // console.log(session)
            const isCreatedSession = await userSessionsRepository.createSessionsRepository(session);
            if (isCreatedSession.acknowledged) {
                return { accessToken, refreshToken };
            } else {
                return INTERNAL_STATUS_CODE.UNAUTHORIZED_SESSION_CREATION_ERROR;
            }
        }
    },
    async updateSessionServices(userId: string, ip: string, userAgent: string, deviceId: string): Promise<UpdateResult<{acknowledged: boolean, insertedId: number}> | any>{
        const { accessToken, refreshToken } = await tokenService.generateTokens(userId, deviceId);
    
        if (!accessToken || !refreshToken) {
            return INTERNAL_STATUS_CODE.UNAUTHORIZED_TOKEN_CREATION_ERROR;
        }
        const userToken = await tokenService.validateRefreshToken(refreshToken);

        const session = {
            ip,
            title: userAgent,
            userId,
            deviceId,
            lastActiveDate: new Date((userToken! as JwtPayload & { iat: number }).iat).toISOString(),
            expirationDate: new Date((userToken! as JwtPayload & { exp: number }).exp).toISOString(),
            // expirationDate: add(new Date(), { 
            //     days: 1 ,
            //     hours: 0,
            //     minutes: 0
            // }),
        };
        const isUpdatedSession = await userSessionsRepository.updateSessionsRepository(session)
        if(isUpdatedSession && isUpdatedSession.acknowledged) {
            return { accessToken, refreshToken };
        }else{
            return INTERNAL_STATUS_CODE.UNAUTHORIZED_SESSION_UPDATION_ERROR;
        }
    },
    async deleteSessionByDeviceIdServices(userId: string, deviceId: string): Promise<{ statusCode: number; message: string; } | any> {
        return await userSessionsRepository.deleteSessionsByDeviceIdRepository(userId, deviceId)
    },
    async deleteAllSessionsServices(userId: string, deviceId: string): Promise<{ statusCode: number; message: string; } | any> {
        return await userSessionsRepository.deleteAllSessionsRepository(userId, deviceId)
    },

    async _getAllSessionsUsersServices(): Promise<any>{
        return await userSessionsRepository._getAllSessionyUsersRepository()
    },
    async _getAllSessionByUserIdServices(userId: string): Promise<any>{
        return await userSessionsRepository._getAllSessionByUserIdRepository(userId)
    },
    async _getSessionByUserIdServices(userId: string, deviceId: string): Promise<any>{
        return await userSessionsRepository._getSessionByUserIdRepository(userId, deviceId)
    },
    async _getSessionByDeviceIdServices(deviceId: string): Promise<any>{
        return await userSessionsRepository._getSessionDeviceByIdRepository(deviceId)
    },
}