import { contextTests } from "../../../shared/__tests__/contextTests";
import { authTestManager } from "../../../shared/__tests__/managersTests/authTestManager";
import { HTTP_STATUSES } from "../../../shared/utils/utils";

export const isCreatedUser1 = async (login: string, email: string, password: string, statusCode: number = HTTP_STATUSES.NO_CONTENT_204) => {
    if (!contextTests.createdUser1) {
        console.log('isCreatedUser1: - contextTests.createdUser1', contextTests.createdUser1)
        const user: any = {
            login,
            password,
            email
        }
        const { body, response } = await authTestManager.registration(
            user,
            statusCode
        )
        if (response.status === HTTP_STATUSES.NO_CONTENT_204) {
            return true
        } else {
            return body
        }
    } else {
        return null
    }
}
export const isCreatedUser2 = async (login: string, email: string, password: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.createdUser2) {
        const user: any = {
            login,
            password,
            email
        }
        const { body, response } = await authTestManager.registration(
            user,
            statusCode
        )
        if (response.status === HTTP_STATUSES.NO_CONTENT_204) {
            return true
        } else {
            return body
        }
    }
}
export const isCreatedUser3 = async (login: string, email: string, password: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.createdUser3) {
        const user: any = {
            login,
            password,
            email
        }
        const { body, response } = await authTestManager.registration(
            user,
            statusCode
        )
        console.log('isCreatedUser3: - body', body)
        if (response.status === HTTP_STATUSES.NO_CONTENT_204) {
            return true
        } else {
            return body
        }
    }
}