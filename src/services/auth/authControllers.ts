import express, { Response } from 'express';
import { inject, injectable } from 'inversify';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { CreateUserModel } from '../users/Users_DTO/CreateUserModel';
import { UserType } from '../users/Users_DTO/userTypes';
import { ResErrorsSwitch } from '../../shared/utils/ErResSwitch';
import { SuccessfulResponse } from '../../shared/utils/SuccessfulResponse';
import { RequestWithParams } from '../../shared/types/typesGeneric';
import { AuthServices } from './authServices';
import { UsersQueryRepository } from '../users/UserRpository/usersQueryRepository';
import * as uuid from 'uuid';

@injectable()
export class AuthControllers {
    constructor(
        @inject(AuthServices) private authServices: AuthServices,
        @inject(UsersQueryRepository) private  usersQueryRepository: UsersQueryRepository,
    ) { }
    async registrationController(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | number>) {
        console.log('AuthControllers - data 😡',
            req.body.login,
            req.body.password,
            req.body.email
        )
        const result = await this.authServices.registrationServices(
            req.body.login,
            req.body.password,
            req.body.email
        )
        console.log('AuthControllers - registration: - result ', result)
        if (result.insertedId) {
            const foundUser: UserType | null = await this.usersQueryRepository.getUserByIdRepository(
                result.insertedId
            )
            if (foundUser) {
                return SuccessfulResponse(res, INTERNAL_STATUS_CODE.NO_CONTENT)
            }
        } else {
            return ResErrorsSwitch(res, result)
        }
    }
    async loginControllers(req: RequestWithParams<any>, res: Response<any>) {
        // @ts-ignore
        // console.log('authControllers: login - userId', String(req.user._id))
        let ip;
        let title;

        req.ip ? ip = req.ip : ip = `There's no ip address on the darknet`
        req.headers['user-agent'] ? title = req.headers['user-agent'] : title = `device unknown='${uuid.v4()}'`
        // @ts-ignore
        const result = await this.authServices.loginServices(String(req.user._id), ip, title)
        // console.log('authControllers: result - ', result)

        if (result) {
            res
                .cookie('refreshToken', result.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: true,
                })
                .header('Authorization', `Bearer ${result.accessToken}`)
                .status(HTTP_STATUSES.OK_200)
                .json({ "accessToken": result.accessToken })
        }
    }
    async logoutControllers(req: RequestWithParams<CreateUserModel>, res: Response<any>) {
        // console.log('authControllers: - logout', String(req.user!.id))

        const isLogout = await this.authServices.logoutServices(
            String(req.user!.id),
            req.cookies.refreshToken
        )
        if (isLogout) {
            res.clearCookie('refreshToken', { httpOnly: true });
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.NO_CONTENT)
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST)
        }
    }
    async refreshControllers(req: RequestWithParams<any>, res: Response<any>) {
        // console.log('authControllers: - refresh-token', String(req.user!.id))

        const isRefresh = await this.authServices.refreshTokenOrSessionService(
            req.ip ? req.ip : `There's no ip address on the darknet`,
            req.headers['user-agent'] ? req.headers['user-agent'] : `device unknown='${uuid.v4()}'`,
            String(req.user!.id),
            req.cookies['refreshToken']
        )
        if (isRefresh === INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND) {
            // console.log('authControllers: - isRefresh', isRefresh)
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST)
        }

        if (isRefresh.refreshToken) {
            return res
                .cookie('refreshToken', isRefresh.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: true,
                })
                .status(HTTP_STATUSES.OK_200)
                .json({ "accessToken": isRefresh.accessToken })
        } else {
            return ResErrorsSwitch(res, isRefresh)
        }

    }
    async confirmationEmailControllers(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | string | any>) {
        const result = await this.authServices.confirmEmail(req.query.code)
        if (result) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED)
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT)
        }
    }
    async registrationConfirmationControllers(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | string | any>) {
        const result = await this.authServices.confirmEmail(req.body.code)
        if (result) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED)
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT)
        }
    }
    async registrationEmailResendingControllers(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | number>) {
        const result = await this.authServices.emailResending(req.body.email);
        if (result === null) {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_USER_NOT_FOUND_OR_EMAIL_ALREADY_CONFIRMED)
        }
        if (result === false) { return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY) }
        return SuccessfulResponse(res, INTERNAL_STATUS_CODE.NO_CONTENT)
    }
    async meControllers(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | string>) {
        const authUser = await this.authServices.me(String(req.user!.id))
        if (authUser) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, '', authUser)
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.USER_NOT_FOUND)
        }
    }
}
