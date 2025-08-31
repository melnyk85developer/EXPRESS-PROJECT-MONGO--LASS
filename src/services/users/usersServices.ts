import * as bcrypt from 'bcryptjs'
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { UpdateUserModel } from "./Users_DTO/UpdateUserModel";
import { UserTypeDB } from "./Users_DTO/userTypes";
import { inject, injectable } from "inversify";
import { UsersRepository } from "./UserRpository/usersRepository";
import { UsersQueryRepository } from "./UserRpository/usersQueryRepository";
// import { usersCollection } from '../../db';
import { MongoDBCollection } from "../../db";

@injectable()
export class UserService {
    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
    ) { }

    async createUserServices(user: any): Promise<InsertOneResult<{ acknowledged: boolean, insertedId: number }> | any> {
        const { accountData, emailConfirmation } = user
        if (accountData.userName && accountData.password && accountData.email) {
            let createUser = new UserTypeDB(
                new ObjectId(),
                {
                    userName: accountData.userName,
                    email: accountData.email,
                    password: await bcrypt.hash(accountData.password, 10),
                    createdAt: accountData.createdAt
                },
                {
                    confirmationCode: emailConfirmation.confirmationCode,
                    expirationDate: emailConfirmation.expirationDate,
                    isConfirmed: emailConfirmation.isConfirmed
                }
            )
            return await this.usersRepository.createUserRepository(createUser as unknown as any)
        }
    }
    async updateUserServices(id: string, body: UpdateUserModel): Promise<UpdateResult<{ acknowledged: boolean, insertedId: number }> | null> {
        const updatedUser = {
            login: body.login,
            email: body.email
        }
        return await this.usersRepository.updateUserRepository(id, updatedUser)
    }
    async updateResendingUserServices(id: string, confirmationCode: string): Promise<UpdateResult<{ acknowledged: boolean, insertedId: number }> | null> {
        return await this.usersRepository.updateResendingUserRepository(id, confirmationCode)
    }
    async deleteUserServices(id: string): Promise<DeleteResult | null> {
        return await this.usersRepository.deleteUserRepository(id)
    }


    async _getUserByIdService(id: string): Promise<UserTypeDB | any> {
        // console.log('_getUserByIdRepo: - ', id)
        try {
            return await this.usersRepository._getUserByIdRepository(id)
        } catch (error) {
            // console.error(error)
            return error
        }
    }
    async _getUserByLoginOrEmailService(loginOrEmail: string): Promise<UserTypeDB | any> {
        // console.log('UserService - loginOrEmail 😡😡', loginOrEmail)
        return await this.usersRepository._getUserByLoginOrEmailRepository(loginOrEmail)
    }
    async _getUserByEmailService(email: string): Promise<UserTypeDB | any> {
        return this.usersRepository._getUserByEmailRepository
    }
    async _findUserByConfirmationCodeService(code: string): Promise<UserTypeDB | any> {
        return this.usersRepository._findUserByConfirmationCodeRepository(code)
    }
}