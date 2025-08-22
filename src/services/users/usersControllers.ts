import express, { Response } from 'express';
import { INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { usersQueryRepository } from './UserRpository/usersQueryRepository';
import { URIParamsUserIdModel } from './Users_DTO/URIParamsUserIdModel';
import { CreateUserModel } from './Users_DTO/CreateUserModel';
import { UpdateUserModel } from './Users_DTO/UpdateUserModel';
import { usersServices } from './usersServices';
import { ResponseUserType, UserType, UserTypeDB } from './Users_DTO/userTypes';
import { ResErrorsSwitch } from '../../shared/utils/ErResSwitch';
import { SuccessfulResponse } from '../../shared/utils/SuccessfulResponse';
import { deleteUserMiddlewares, getAllUsersMiddlewares, getUserByIdMiddlewares, postUserMiddlewares, updateUserMiddlewares } from './UserMiddlewares/userArrayMiddlewares';
import { RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../../shared/types/typesGeneric';
import { superAdminAdapter } from '../../shared/infrastructure/createSuperAdminAdapter';

export class UsersControllers {
    async createUser(req: RequestWithParams<CreateUserModel>, res: Response<UserType>) {
        const { login, email, password } = req.body
        const superAdmin = await superAdminAdapter.createUser(login, email, password)
        if (superAdmin.accountData.email) {
            const createUser = await usersServices.createUserServices(superAdmin as unknown as UserTypeDB)
            if (createUser.acknowledged) {
                return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_CREATED_USER, undefined, await usersQueryRepository.getUserByIdRepository(createUser.insertedId as unknown as string))
            }
        } else {
            return ResErrorsSwitch(res, superAdmin)
        }
        return null
    }
    async updateUser(req: RequestWithParamsAndBody<URIParamsUserIdModel, UpdateUserModel> | any, res: Response<UserType>) {
        const updateUser = await usersServices.updateUserServices(req.params.id, req.body)
        if (updateUser && updateUser.acknowledged) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_UPDATED_USER)
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_UPDATED_USER)
        }
    }
    async getUser(req: RequestWithParams<URIParamsUserIdModel>, res: Response<UserType>) {
        const found: UserType | null = await usersQueryRepository.getUserByIdRepository(req.params.id);
        if (found) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, undefined, found)
        } else {
            return ResErrorsSwitch(res, 0, 'Не известная ошибка при получении пользователя!')
        }
    }
    async getAllUsers(req: RequestWithParams<URIParamsUserIdModel> & RequestWithQuery<{ [key: string]: string | undefined }>, res: Response<ResponseUserType | null>) {
        return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, undefined, await usersQueryRepository.getAllUsersRepository(req))
    }
    async deleteUser(req: RequestWithParams<URIParamsUserIdModel>, res: Response<UserType>) {
        const isDeletedUser = await usersServices.deleteUserServices(req.params.id);
        if (isDeletedUser && isDeletedUser.acknowledged) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_DELETED_USER)
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_USER)
        }
    }
}
export const usersController = new UsersControllers()