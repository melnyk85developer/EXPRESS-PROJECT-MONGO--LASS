import request from "supertest";
import {app} from "../../../src/app";
import { AuthModel } from "../../../src/services/auth/AuthModel";
import { HTTP_STATUSES, HttpStatusType } from "../../../src/shared/utils/utils";
import { SETTINGS } from "../../../src/shared/settings";

export const getRequest = () => {
    return request(app)
}
export const authTestManager = {
    async registration(
        data: AuthModel,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204){
        const response = await getRequest()
            .post(`${SETTINGS.RouterPath.auth}/registration`)
            .send(data)
            .set('User-Agent', 'TestDevice/1.0')
            .expect(expectedStatusCode);
        return {response: response, createUser: response.body}
    },
    async login(
        data: AuthModel,
        userAgent: string = 'TestDevice/1.0',
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204){

        const response = await getRequest()
            .post(`${SETTINGS.RouterPath.auth}/login`)
            .send(data)
            .set('User-Agent', `${userAgent}`)
            .expect(expectedStatusCode);

        const authHeader = response.headers['authorization'];
        const token = authHeader ? authHeader.split(' ')[1] : null;

        const accessToken = response.headers['authorization']?.split(' ')[1] || null;
        const refreshToken = response.headers['set-cookie']?.[0]?.split(';')[0]?.split('=')[1] || null;

        return {response: response, accessToken, refreshToken}
    },
    async getUserInfo(
        accessToken: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200){
        const response = await getRequest()
            .get(`${SETTINGS.RouterPath.auth}/me`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(expectedStatusCode);

        let userInfo: any = null

        if(expectedStatusCode === HTTP_STATUSES.OK_200){
            userInfo = response.body;
            expect(userInfo)
                .toEqual(
                    {
                        userId: expect.any(String),
                        login: expect.any(String),
                        email: expect.any(String),
                    }
                )
        }
        return {response: response, userInfo: response.body}
    },
    async logout(
        accessToken: string,
        refreshToken: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204){
            // console.log('accessToken: - ', accessToken)
            // console.log('refreshToken: - ', refreshToken)
            const response = await getRequest()
            .post(`${SETTINGS.RouterPath.auth}/logout`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode);
    
        if (expectedStatusCode === HTTP_STATUSES.NO_CONTENT_204) {
            const clearedCookies = response.headers['set-cookie'];
            expect(clearedCookies).toBeDefined();
            expect(clearedCookies[0]).toContain('refreshToken=;'); // Убедимся, что куки очищены
        }
    },
    async refreshToken(
        accessToken: string | null,
        refreshToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200){
        // console.log('TEST authTestManager refreshToken: - req', refreshToken)

        const response = await getRequest()
            .post(`${SETTINGS.RouterPath.auth}/refresh-token`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode);

        // console.log('TEST authTestManager refreshToken: - response', response.body)
        // Проверяем заголовок 'set-cookie'
        const setCookieHeader = response.headers['set-cookie'];

        // let extractedRefreshToken = setCookieHeader ? setCookieHeader[0] : null;
        
        let extractedRefreshToken: string | null = null;

        if (Array.isArray(setCookieHeader)) {
            // Если это массив строк
            extractedRefreshToken = setCookieHeader
                .find((cookie: string) => cookie.startsWith('refreshToken='))
                ?.split('=')[1]
                ?.split(';')[0];
        } else if (typeof setCookieHeader === 'string') {
            // Если это одна строка
            if (setCookieHeader.startsWith('refreshToken=')) {
                extractedRefreshToken = setCookieHeader
                    .split('=')[1]
                    .split(';')[0];
            }
        }

        return {response: response, refresh: extractedRefreshToken}
    }
};