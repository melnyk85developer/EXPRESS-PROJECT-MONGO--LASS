import { Response } from 'express';
import { INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { URIParamsUserIdModel } from './Users_DTO/URIParamsUserIdModel';
import { CreateUserModel } from './Users_DTO/CreateUserModel';
import { UpdateUserModel } from './Users_DTO/UpdateUserModel';;
import { ResponseUserType, UserType, UserTypeDB } from './Users_DTO/userTypes';
import { ErRes } from '../../shared/utils/ErRes';
import { RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../../shared/types/typesGeneric';
import { UsersQueryRepository } from './UserRpository/usersQueryRepository';
import { UserService } from './usersServices';
import { SuperAdminAdapter } from '../../shared/infrastructure/createSuperAdminAdapter';
import { inject, injectable } from 'inversify';
import { SuccessResponse } from '../../shared/utils/SuccessResponse';

@injectable()
export class UsersControllers {
    constructor(
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
        @inject(UserService) protected usersServices: UserService,
        @inject(SuperAdminAdapter) protected superAdminAdapter: SuperAdminAdapter
    ) { }
    async createUser(req: RequestWithParams<CreateUserModel>, res: Response<UserType>) {
        const { login, email, password } = req.body
        const superAdmin = await this.superAdminAdapter.createUser(login, email, password)
        if (superAdmin.accountData.email) {
            const createUser = await this.usersServices.createUserServices(superAdmin as unknown as UserTypeDB)
            if (createUser.acknowledged) {
                return SuccessResponse(
                    INTERNAL_STATUS_CODE.SUCCESS_CREATED_USER,
                    await this.usersQueryRepository.getUserByIdRepository(createUser.insertedId as unknown as string),
                    undefined,
                    req,
                    res
                )
            }
        } else {
            return new ErRes(
                superAdmin,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
    async updateUser(req: RequestWithParamsAndBody<URIParamsUserIdModel, UpdateUserModel> | any, res: Response<UserType>) {
        const updateUser = await this.usersServices.updateUserServices(req.params.id, req.body)
        if (updateUser && updateUser.acknowledged) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS_UPDATED_USER,
                undefined,
                undefined,
                req,
                res
            )
        } else {
            return new ErRes(
                INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_UPDATED_USER,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
    async getUser(req: RequestWithParams<URIParamsUserIdModel>, res: Response<UserType>) {
        const found: UserType | null = await this.usersQueryRepository.getUserByIdRepository(req.params.id);
        if (found) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS,
                found,
                undefined,
                req,
                res
            )
        } else {
            return new ErRes(
                400,
                undefined,
                'Не известная ошибка при получении пользователя!',
                req,
                res
            )
        }
    }
    async getAllUsers(req: RequestWithParams<URIParamsUserIdModel> & RequestWithQuery<{ [key: string]: string | undefined }>, res: Response<ResponseUserType | null>) {
        return SuccessResponse(
            INTERNAL_STATUS_CODE.SUCCESS,
            await this.usersQueryRepository.getAllUsersRepository(req),
            undefined,
            req,
            res
        )
    }
    async deleteUser(req: RequestWithParams<URIParamsUserIdModel>, res: Response<UserType>) {
        const isDeletedUser = await this.usersServices.deleteUserServices(req.params.id);
        if (isDeletedUser && isDeletedUser.acknowledged) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS_DELETED_USER,
                undefined,
                undefined,
                req,
                res
            )
        } else {
            return new ErRes(
                INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_USER,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
}