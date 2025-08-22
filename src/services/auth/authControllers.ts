import express, { Response } from 'express';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { CreateUserModel } from '../users/Users_DTO/CreateUserModel';
import { authServices } from './authServices';
import { UserType } from '../users/Users_DTO/userTypes';
import { usersQueryRepository } from '../users/UserRpository/usersQueryRepository';
import { ResErrorsSwitch } from '../../shared/utils/ErResSwitch';
import { SuccessfulResponse } from '../../shared/utils/SuccessfulResponse';
import { confirmationEmailMiddlewares, loginMiddlewares, logoutMiddlewares, meMiddlewares, refreshTokenMiddlewares, registrationConfirmMiddlewares, registrationEmailResendingMiddlewares, registrationMiddlewares } from './AuthMiddlewares/authArrayMiddlewares';
import * as uuid from 'uuid';
import { JwtPayload } from 'jsonwebtoken';
import { RequestWithParams } from '../../shared/types/typesGeneric';

export class AuthControllers {
    async registration(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | number>) {
        const result = await authServices.registration(
            req.body.login,
            req.body.password,
            req.body.email
        )
        // console.log('result: - ', result)
        if (result.insertedId) {
            const foundUser: UserType | null = await usersQueryRepository.getUserByIdRepository(
                result.insertedId
            );
            if (foundUser) {
                return SuccessfulResponse(res, INTERNAL_STATUS_CODE.NO_CONTENT)
            }
        } else {
            return ResErrorsSwitch(res, result)
        }
    }
    async login(req: RequestWithParams<any>, res: Response<any>) {
        // @ts-ignore
        // console.log('authControllers: login - userId', String(req.user._id))
        let ip;
        let title;

        req.ip ? ip = req.ip : ip = `There's no ip address on the darknet`
        req.headers['user-agent'] ? title = req.headers['user-agent'] : title = `device unknown='${uuid.v4()}'`
        // @ts-ignore
        const result = await authServices.loginServices(String(req.user._id), ip, title)
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
    async logout(req: RequestWithParams<CreateUserModel>, res: Response<any>) {
        // console.log('authControllers: - logout', String(req.user!.id))

        const isLogout = await authServices.logoutServices(
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
    async refresh(req: RequestWithParams<any>, res: Response<any>) {
        // console.log('authControllers: - refresh-token', String(req.user!.id))

        const isRefresh = await authServices.refreshTokenOrSessionService(
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
    async confirmationEmail(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | string | any>) {
        const result = await authServices.confirmEmail(req.query.code)
        if (result) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED)
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT)
        }
    }
    async registrationConfirmation(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | string | any>) {
        const result = await authServices.confirmEmail(req.body.code)
        if (result) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED)
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT)
        }
    }
    async registrationEmailResending(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | number>) {
        const result = await authServices.emailResending(req.body.email);
        if (result === null) { return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_USER_NOT_FOUND_OR_EMAIL_ALREADY_CONFIRMED) }
        if (result === false) { return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY) }
        return SuccessfulResponse(res, INTERNAL_STATUS_CODE.NO_CONTENT)
    }
    async me(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | string>) {
        const authUser = await authServices.me(String(req.user!.id))
        if (authUser) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, '', authUser)
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.USER_NOT_FOUND)
        }
    }
}
export const authController = new AuthControllers()
