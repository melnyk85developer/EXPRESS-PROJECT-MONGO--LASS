import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { CreateUserModel } from "./Users_DTO/CreateUserModel";
import { UpdateUserModel } from "./Users_DTO/UpdateUserModel";
import { usersRepository } from "./UserRpository/usersRepository";
import { usersCollection } from "../../db";
import { INTERNAL_STATUS_CODE } from "../../utils/utils";
import { UserTypeDB } from "./Users_DTO/userTypes";
import * as bcrypt from 'bcryptjs'
import * as uuid from 'uuid';
import { add } from "date-fns";

export const usersServices = {
    async createUserServices(user: UserTypeDB): Promise<InsertOneResult<{acknowledged: boolean, insertedId: number}> | any>{
        const {accountData, emailConfirmation } = user
        if(accountData.userName && accountData.password && accountData.email){
            const createUser = {
                accountData: {
                    userName: accountData.userName,
                    email: accountData.email,
                    password: await bcrypt.hash(accountData.password, 10),
                    createdAt: accountData.createdAt
                },
                emailConfirmation: {
                    confirmationCode: emailConfirmation.confirmationCode,
                    expirationDate: emailConfirmation.expirationDate,
                    isConfirmed: emailConfirmation.isConfirmed
                }
            }
            // console.log('createUserServices: - ', createUser)
            return await usersRepository.createUserRepository(createUser as unknown as any)
        }
    },
    async updateUserServices(id: string, body: UpdateUserModel): Promise<UpdateResult<{acknowledged: boolean, insertedId: number}>  | null> {
        const updatedUser = {
            login: body.login,
            email: body.email
        }
        return await usersRepository.updateUserRepository(id, updatedUser)
    },
    async updateResendingUserServices(id: string, confirmationCode: string): Promise<UpdateResult<{acknowledged: boolean, insertedId: number}>  | null> {
        return await usersRepository.updateResendingUserRepository(id, confirmationCode)
    },
    async deleteUserServices(id: string): Promise<DeleteResult | null> {
        return await usersRepository.deleteUserRepository(id)
    },
    async _getUserByIdRepo(id: string): Promise<UserTypeDB | any>{
        // console.log('_getUserByIdRepo: - ', id)
        try {
            return await usersCollection.findOne({ _id: new ObjectId(id) }) 
        }catch(error){
            // console.error(error)
            return error
        }
    },
    async _getUserByLoginOrEmail(loginOrEmail: string): Promise<UserTypeDB | any> {
        try {
            const getUser = await usersCollection.findOne({
                $or: [
                    { 'accountData.userName': loginOrEmail },
                    { 'accountData.email': loginOrEmail },
                ]
            })
            if(getUser){return getUser}
        }catch(error){
            // console.error(error);
            return error;
        }
    },
    async _getUserByEmail(email: string): Promise<UserTypeDB | any> {
        try {
            const getUser = await usersCollection.findOne({'accountData.email': email })
            if(getUser){return getUser}
        }catch(error){
            // console.error(error);
            return error;
        }
    },
    async _findUserByConfirmationCode(code: string): Promise<UserTypeDB | any>{
        try {
            const getUser = await usersCollection.findOne({ 'emailConfirmation.confirmationCode': code })
            // console.log('_findUserByConfirmationCode - ', getUser)
            if (getUser) {
                return getUser
            }
        }catch(error){
            // console.error(error);
            return error;
        }
    }
}