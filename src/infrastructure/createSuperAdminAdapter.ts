import * as uuid from 'uuid';
import { add } from "date-fns";
import { usersServices } from '../services/users/usersServices';
import { INTERNAL_STATUS_CODE } from '../utils/utils';
import { UserType } from '../services/users/Users_DTO/userTypes';

export const superAdminAdapter = {
    async createUser(login: string, email: string, password: string): Promise<UserType | null | any>{
        const isLogin = await usersServices._getUserByLoginOrEmail(login)
        const isEmail = await usersServices._getUserByLoginOrEmail(email)
      
        if(!isLogin && !isEmail){
            const date = new Date()
            // date.setMilliseconds(0)
            const confirmationCode = uuid.v4()
            const createdAt = date.toISOString()
            const createdUser = {
                accountData: {
                    userName: login,
                    email,
                    password: password,
                    createdAt: createdAt
                },
                emailConfirmation: {
                    confirmationCode: confirmationCode,
                    expirationDate: add(new Date(), {
                        hours: 1,
                        minutes: 3
                    }),
                    isConfirmed: true
                }
            }
            return createdUser
        }
        if(isEmail){return INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_EMAIL_ALREADY_EXISTS}
        if(isLogin){return INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_LOGIN_ALREADY_EXISTS}
    }
}