import 'reflect-metadata';
import express, { Response } from 'express';
import { INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { URIParamsUserIdModel } from './Users_DTO/URIParamsUserIdModel';
import { CreateUserModel } from './Users_DTO/CreateUserModel';
import { UpdateUserModel } from './Users_DTO/UpdateUserModel';;
import { ResponseUserType, UserType, UserTypeDB } from './Users_DTO/userTypes';
import { ResErrorsSwitch } from '../../shared/utils/ErResSwitch';
import { SuccessfulResponse } from '../../shared/utils/SuccessfulResponse';
import { RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../../shared/types/typesGeneric';
import { UsersQueryRepository } from './UserRpository/usersQueryRepository';
import { UserService } from './usersServices';
import { SuperAdminAdapter } from '../../shared/infrastructure/createSuperAdminAdapter';
import { TYPES } from '../../shared/container/types'
import { inject, injectable } from 'inversify';

@injectable()
export class UsersControllers {
    constructor(
        // @ts-ignore
        @inject(UsersQueryRepository)
        protected usersQueryRepository: UsersQueryRepository,
        // @ts-ignore
        @inject(UserService)
        protected usersServices: UserService,
        // @ts-ignore
        @inject(SuperAdminAdapter) 
        protected superAdminAdapter: SuperAdminAdapter
    ) { }
    async createUser(req: RequestWithParams<CreateUserModel>, res: Response<UserType>) {
        const { login, email, password } = req.body
        const superAdmin = await this.superAdminAdapter.createUser(login, email, password)
        if (superAdmin.accountData.email) {
            const createUser = await this.usersServices.createUserServices(superAdmin as unknown as UserTypeDB)
            if (createUser.acknowledged) {
                return SuccessfulResponse(
                    res, 
                    INTERNAL_STATUS_CODE.SUCCESS_CREATED_USER, 
                    undefined,
                    await this.usersQueryRepository.getUserByIdRepository(createUser.insertedId as unknown as string)
                )
            }
        } else {
            return ResErrorsSwitch(res, superAdmin)
        }
        return null
    }
    async updateUser(req: RequestWithParamsAndBody<URIParamsUserIdModel, UpdateUserModel> | any, res: Response<UserType>) {
        const updateUser = await this.usersServices.updateUserServices(req.params.id, req.body)
        if (updateUser && updateUser.acknowledged) {
            return SuccessfulResponse(
                res, 
                INTERNAL_STATUS_CODE.SUCCESS_UPDATED_USER
            )
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_UPDATED_USER)
        }
    }
    async getUser(req: RequestWithParams<URIParamsUserIdModel>, res: Response<UserType>) {
        const found: UserType | null = await this.usersQueryRepository.getUserByIdRepository(req.params.id);
        if (found) {
            return SuccessfulResponse(
                res,
                INTERNAL_STATUS_CODE.SUCCESS, 
                undefined, 
                found
            )
        } else {
            return ResErrorsSwitch(res, 0, 'Не известная ошибка при получении пользователя!')
        }
    }
    async getAllUsers(req: RequestWithParams<URIParamsUserIdModel> & RequestWithQuery<{ [key: string]: string | undefined }>, res: Response<ResponseUserType | null>) {
        return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, undefined, await this.usersQueryRepository.getAllUsersRepository(req))
    }
    async deleteUser(req: RequestWithParams<URIParamsUserIdModel>, res: Response<UserType>) {
        const isDeletedUser = await this.usersServices.deleteUserServices(req.params.id);
        if (isDeletedUser && isDeletedUser.acknowledged) {
            return SuccessfulResponse(
                res, 
                INTERNAL_STATUS_CODE.SUCCESS_DELETED_USER
            )
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_USER)
        }
    }
}