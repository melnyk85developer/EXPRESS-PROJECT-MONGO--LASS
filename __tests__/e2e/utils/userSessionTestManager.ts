import "reflect-metadata"
import request from "supertest";
import { SETTINGS } from "../../../src/shared/settings";
import {app} from "../../../src/app";
import { JwtPayload } from "jsonwebtoken";
import { SessionType } from "../../../src/services/usersSessions/Sessions_DTO/sessionsType";
import { CreateUserModel } from "../../../src/services/users/Users_DTO/CreateUserModel";
import { HTTP_STATUSES, HttpStatusType } from "../../../src/shared/utils/utils";
// import { container } from "../../../src/shared/container/iocRoot";
import { TokenService } from "../../../src/shared/infrastructure/tokenService";
import { SecurityDeviceServices } from "../../../src/services/usersSessions/securityDeviceService";
import { tokenService, securityDeviceServices } from "../../../src/shared/container/compositionRootCustom";
// import { securityDeviceServices, tokenService } from "../../../src/shared/container/compositionRootCustom";

// const tokenService: TokenService = container.resolve(TokenService)
// const securityDeviceServices: SecurityDeviceServices = container.resolve(SecurityDeviceServices)

export const getRequest = () => {
    return request(app)
}
const buff2 = Buffer.from(SETTINGS.ADMIN, 'utf8')
const codedAuth = buff2.toString('base64')

export const usersSessionTestManager = {
    async getAllUserSessionByUserId(
        refreshToken: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200){
            // console.log('getAllUserSessionByUserId: - ', accessToken, refreshToken)
        const response = await getRequest()
            .get(`${SETTINGS.RouterPath.security}/devices`)
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode)
        // console.log('usersTestManager - res', response.body)
        let arrSessions: SessionType[] = response.body
        const userToken = await tokenService.validateRefreshToken(refreshToken);
        expect(Array.isArray(arrSessions)).toBe(true);
        expect(arrSessions).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    ip: expect.any(String),
                    title: expect.any(String),
                    deviceId: expect.any(String),
                    lastActiveDate: expect.any(String)
                })
            ])
        );
        return {response: response.body, arrSessions: arrSessions}
    },
    async getSessionUserById(
        deviceId: string | JwtPayload | null,
        accessToken: string,
        refreshToken: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        const response = await getRequest()
            .get(`${SETTINGS.RouterPath.security}/devices/${deviceId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode)
        // console.log('usersTestManager - res', id)
        return {response: response, resSessionUserById: response.body}
    },
    async updateUserSession(
        id: string,
        data: CreateUserModel,

        codedAuth: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204){
        // console.log('usersTestManager - updateUser data, codedAuth', data, codedAuth)
        const response = await getRequest()
            .put(`${SETTINGS.RouterPath.users}/${id}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Basic ${codedAuth}`)
            .send(data)
            .expect(expectedStatusCode)

        let updateUser
        // accessToken: string | undefined = undefined,
        // .set('Authorization', `Bearer ${accessToken}`)
        // console.log('usersTestManager - ', accessToken)

        if(expectedStatusCode === HTTP_STATUSES.UNAUTHORIZED_401){expect(expectedStatusCode)}

        if(expectedStatusCode === HTTP_STATUSES.NO_CONTENT_204){
            updateUser = response.body;
        }
        return {response: response, updateUser: updateUser}
    },
    async deleteUserSessions(
        refreshToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        // console.log('deleteUserSessions - res accessToken & refreshToken', accessToken, refreshToken)

        const response = await getRequest()
            .delete(`${SETTINGS.RouterPath.security}/devices`)
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode)
        // console.log('usersTestManager - res', response.body)
        let isDeleted = response.body
        return {response: response.body, isDeleted: isDeleted}
    },
    async deleteSessionByDeviceId(
        deviceId: string,
        refreshToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        const response = await getRequest()
            .delete(`${SETTINGS.RouterPath.security}/devices/${deviceId}`)
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode)
        // console.log('usersTestManager - res', response.body)
        return {response: response, deleteUser: response.body}
    },
    async createArrayUsersSessions(
        count: number = 10,
        codedAuth: string | undefined = undefined,
        authToken2: string | null = null){

        const userToken = await tokenService.validateRefreshToken(authToken2);
        for(let i = 0; i < count; i++){
            await securityDeviceServices.createSessionServices(
                (userToken as JwtPayload & { userId: string }).userId.toString(),
                `::ffff:127.0.0.${i}`,
                `user-agent/INTEGRATION-TEST/0.${i}}`
            )
        }
    },

    async getAllUsersSessions(
        accessToken: string,
        refreshToken: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200){
        const response = await getRequest()
            .get(`${SETTINGS.RouterPath.security}/devices-all`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode)
        // console.log('usersTestManager - res', response.body)
        return {response: response, getAllUserSession: response.body}
    },
}