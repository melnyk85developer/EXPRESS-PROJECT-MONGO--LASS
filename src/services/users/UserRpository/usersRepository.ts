import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { CreateUserModel } from "../Users_DTO/CreateUserModel";
import { UpdateUserModel } from "../Users_DTO/UpdateUserModel";;
import { inject, injectable } from "inversify";
import { MongoDBCollection } from "../../../db";
import { UserTypeDB } from "../Users_DTO/userTypes";

@injectable()
export class UsersRepository {
    constructor(
        @inject(MongoDBCollection) private mongoDB: MongoDBCollection
    ) { }

    async createUserRepository(user: CreateUserModel): Promise<InsertOneResult<{ acknowledged: boolean, insertedId: number }> | null> {
        try {
            // console.log('usersRepository - user: ', user)
            const createUser = await this.mongoDB.usersCollection.insertOne(user)
            // console.log('createUserRepository: - ', createUser)
            return createUser
        } catch (e) {
            console.error(e)
            return null
        }
    }
    async updateUserRepository(id: string, body: UpdateUserModel): Promise<UpdateResult<{ acknowledged: boolean, insertedId: number }> | null> {
        try {
            return await this.mongoDB.usersCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        'accountData.userName': body.login,
                        'accountData.email': body.email
                    }
                }
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
    async updateResendingUserRepository(id: string, confirmationCode: string): Promise<UpdateResult<{ acknowledged: boolean, insertedId: number }> | null> {
        try {
            return await this.mongoDB.usersCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        'emailConfirmation.confirmationCode': confirmationCode,
                    }
                }
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
    async updatePasswordRepository(password: string, userId: number): Promise<ObjectId | null> {
        const updatePassword = await this.mongoDB.usersCollection.updateOne(
            { password },
            {
                where: { userId },
                returning: true
            }
        );
        return updatePassword.upsertedId
    }
    async deleteUserRepository(id: string): Promise<DeleteResult | null> {
        try {
            return await this.mongoDB.usersCollection.deleteOne({ _id: new ObjectId(id) })
        } catch (e) {
            console.error(e)
            return null
        }
    }
    async updateConfirmationUserRepository(_id: ObjectId) {
        let result = await this.mongoDB.usersCollection.updateOne({ _id }, { $set: { 'emailConfirmation.isConfirmed': true } })
        return result.modifiedCount === 1
    }

    async _getUserByIdRepository(id: string): Promise<UserTypeDB | any> {
        // console.log('_getUserByIdRepo: - ', id)
        try {
            return await this.mongoDB.usersCollection.findOne({ _id: new ObjectId(id) })
        } catch (error) {
            // console.error(error)
            return error
        }
    }
    async _getUserByLoginOrEmailRepository(loginOrEmail: string): Promise<UserTypeDB | any> {
        // console.log('UsersRepository - loginOrEmail 😡😡😡', loginOrEmail)

        try {
            const getUser = await this.mongoDB.usersCollection.findOne({
                $or: [
                    { 'accountData.userName': loginOrEmail },
                    { 'accountData.email': loginOrEmail },
                ]
            })
            // console.log('UsersRepository: - 😡', getUser)
            if (getUser) {
                return getUser
            }
        } catch (error) {
            // console.error(error);
            return error;
        }
    }
    async _getUserByEmailRepository(email: string): Promise<UserTypeDB | any> {
        try {
            const isUser = await this.mongoDB.usersCollection.findOne({ 'accountData.email': email })
            if (isUser) {
                // console.log('UsersRepository _getUserByEmailRepository: - isUser', isUser)
                return isUser
            } else {
                return null
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }
    async _findUserByConfirmationCodeRepository(code: string): Promise<UserTypeDB | any> {
        try {
            const getUser = await this.mongoDB.usersCollection.findOne({ 'emailConfirmation.confirmationCode': code })
            // console.log('_findUserByConfirmationCode - ', getUser)
            if (getUser) {
                return getUser
            }
        } catch (error) {
            // console.error(error);
            return error;
        }
    }
}