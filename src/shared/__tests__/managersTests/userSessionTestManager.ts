import request from "supertest";
import { JwtPayload } from "jsonwebtoken";
import { app } from "../../../app";
import { SETTINGS } from "../../settings";
import { HTTP_STATUSES, HttpStatusType } from "../../utils/utils";
import { SessionType } from "../../../services/usersSessions/Sessions_DTO/sessionsType";
import { CreateUserModel } from "../../../services/users/Users_DTO/CreateUserModel";
import { contextTests } from "../contextTests";

export const getRequest = () => {
    return request(app)
}

export const usersSessionTestManager = {
    async getAllUserSessionByUserId(
        refreshToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200){
            // console.log('getAllUserSessionByUserId: - ', accessToken, refreshToken)
        const response = await getRequest()
            .get(`${SETTINGS.RouterPath.security}/devices`)
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode)
        // console.log('usersTestManager - res', response.body)
        let arrSessions: SessionType[] = response.body

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
        refreshToken: string | null,
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
        refreshToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        const response = await getRequest()
            .delete(`${SETTINGS.RouterPath.security}/devices/${deviceId}`)
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode)
        // console.log('usersTestManager - res', response.body)
        return {response: response, deleteUser: response.body}
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