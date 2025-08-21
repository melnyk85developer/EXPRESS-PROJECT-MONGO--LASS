import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { usersCollection } from "../../../db";
import { CreateUserModel } from "../Users_DTO/CreateUserModel";
import { UpdateUserModel } from "../Users_DTO/UpdateUserModel";

export const usersRepository = {
    async createUserRepository(user: CreateUserModel): Promise<InsertOneResult<{acknowledged: boolean, insertedId: number}>  | null> {
        try {
            // console.log('usersRepository - user: ', user)
            const createUser = await usersCollection.insertOne(user)
            // console.log('createUserRepository: - ', createUser)
            return createUser
        }catch(e){
            console.error(e)
            return null
        }
    },
    async updateUserRepository(id: string, body: UpdateUserModel): Promise<UpdateResult<{acknowledged: boolean, insertedId: number}>  | null> {
        try {
            return await usersCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        'accountData.userName': body.login,
                        'accountData.email': body.email
                    }
                }
            )
        }catch(e){
            console.error(e)
            return null
        }
    },
    async updateResendingUserRepository(id: string, confirmationCode: string): Promise<UpdateResult<{acknowledged: boolean, insertedId: number}>  | null> {
        try {
            return await usersCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        'emailConfirmation.confirmationCode': confirmationCode,
                    }
                }
            )
        }catch(e){
            console.error(e)
            return null
        }
    },
    async deleteUserRepository(id: string): Promise<DeleteResult | null> {
        try {
            return await usersCollection.deleteOne({_id: new ObjectId(id)})
        }catch(e){
            console.error(e)
            return null
        }  
    },
    async updateConfirmationUserRepository(_id: ObjectId){
        let result = await usersCollection.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    }
}