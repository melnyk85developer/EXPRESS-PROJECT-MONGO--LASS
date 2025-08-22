import request from "supertest";
import { SETTINGS } from "../../../src/settings";
import {app} from "../../../src/app";
import { JwtPayload } from "jsonwebtoken";
import { CreateUserModel } from "../../../src/services/users/Users_DTO/CreateUserModel";
import { HTTP_STATUSES, HttpStatusType } from "../../../src/shared/utils/utils";

export const getRequest = () => {
    return request(app)
}
export const usersTestManager = {
    async getAllUsers(
        params: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        const response = await getRequest()
            .get(params ? `${SETTINGS.RouterPath.users}${params}` : `${SETTINGS.RouterPath.users}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .expect(expectedStatusCode)
        // console.log('usersTestManager - res', response.body)
        return {response: response, getAllUsers: response.body}
    },
    async getUserById(
        id: string | JwtPayload | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        const response = await getRequest()
            .get(`${SETTINGS.RouterPath.users}/${id}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .expect(expectedStatusCode)
        // console.log('usersTestManager - res', id)
        return {response: response, getUsersById: response.body}
    },
    async createUser(
        data: CreateUserModel,
        // accessToken: string | undefined = undefined,
        codedAuth: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('usersTestManager - data', data)
        
        const response = await getRequest()
            .post(`${SETTINGS.RouterPath.users}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Basic ${codedAuth}`)
            .send(data)
            .expect(expectedStatusCode)

        // console.log('usersTestManager - data', response.body)

        let createdEntity
            // .set('Authorization', `Basic ${codedAuth}`)
            // .set('Authorization', `Bearer ${accessToken}`)
        if(expectedStatusCode === HTTP_STATUSES.UNAUTHORIZED_401){expect(expectedStatusCode)}

        if(expectedStatusCode === HTTP_STATUSES.CREATED_201){
            createdEntity = response.body;
            expect(createdEntity)
            .toEqual(
                {
                    id: expect.any(String),
                    login: data.login,
                    email: data.email,
                    createdAt: expect.any(String),
                }
            )
        }
        return {response: response.body, createdEntity: createdEntity}
    },
    async updateUser(
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
    async deleteUser(
        userId: string,
        // accessToken: string | undefined = undefined,
        codedAuth: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        const response = await getRequest()
            .delete(`${SETTINGS.RouterPath.users}/${userId}`)
            // .set('User-Agent', 'TestDevice/1.0')
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Authorization', `Basic ${codedAuth}`)
            .expect(expectedStatusCode)
        // console.log('usersTestManager - res', response.body)
        return {response: response, deleteUser: response.body}
    },
    async createArrayUsers(
        count: number = 10,
        accessToken: string | undefined = undefined){
        const users: Array<CreateUserModel> = []
    
        for(let i = 0; i < count; i++){
            const {createdEntity} = await usersTestManager.createUser({
                login: `MyLogin${i}`,
                password: `password${i}`,
                email: `webmars${i}@mars.com`
            }, accessToken, HTTP_STATUSES.CREATED_201)
            users.push(createdEntity)
            
        }
        // console.log('for: ', users)
        return users
    }
}