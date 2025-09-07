import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { CreateUserModel } from '../users/Users_DTO/CreateUserModel';
import { UserType } from '../users/Users_DTO/userTypes';
import { ErRes } from '../../shared/utils/ErRes';
// import { SuccessfulResponse } from '../../shared/utils/SuccessfulResponse';
import { RequestWithParams } from '../../shared/types/typesGeneric';
import { AuthServices } from './authServices';
import { UsersQueryRepository } from '../users/UserRpository/usersQueryRepository';
import * as uuid from 'uuid';
import { UserService } from '../users/usersServices';
import { SuccessResponse } from '../../shared/utils/SuccessResponse';

@injectable()
export class AuthControllers {
    constructor(
        @inject(AuthServices) private authServices: AuthServices,
        @inject(UserService) private userService: UserService,
        @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
    ) { }
    async registrationController(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | number>) {
        // console.log('AuthControllers - data 😡 registrationController',
        //     req.body.login,
        //     req.body.password,
        //     req.body.email
        // )
        const result = await this.authServices.registrationServices(
            req.body.login,
            req.body.password,
            req.body.email
        )
        // console.log('AuthControllers - registration: - result ', result)
        if (result.insertedId) {
            const foundUser: UserType | null = await this.usersQueryRepository.getUserByIdRepository(
                result.insertedId
            )
            if (foundUser) {
                return SuccessResponse(
                    INTERNAL_STATUS_CODE.NO_CONTENT,
                    undefined,
                    undefined,
                    undefined,
                    res
                )
            }
        } else {
            throw new ErRes(result, undefined, undefined, req, res)
        }
    }
    async loginController(req: RequestWithParams<any>, res: Response<any>) {
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
    async logoutController(req: RequestWithParams<CreateUserModel>, res: Response<any>) {
        // console.log('authControllers: - logout', String(req.user!.id))

        const isLogout = await this.authServices.logoutServices(
            String(req.user!.id),
            req.cookies.refreshToken
        )
        if (isLogout) {
            res.clearCookie('refreshToken', { httpOnly: true });
            return SuccessResponse(
                INTERNAL_STATUS_CODE.NO_CONTENT,
                undefined,
                undefined,
                req,
                res,
            )
        } else {
            return new ErRes(
                INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
    async refreshController(req: RequestWithParams<any>, res: Response<any>) {
        // console.log('authControllers: - refresh-token', String(req.user!.id))
        const isRefresh = await this.authServices.refreshTokenOrSessionService(
            req.ip ? req.ip : `There's no ip address on the darknet`,
            req.headers['user-agent'] ? req.headers['user-agent'] : `device unknown='${uuid.v4()}'`,
            String(req.user!.id),
            req.cookies['refreshToken']
        )
        if (isRefresh === INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND) {
            // console.log('authControllers: - isRefresh', isRefresh)
            return new ErRes(
                INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST,
                undefined,
                undefined,
                req,
                res,
            )
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
            return new ErRes(
                isRefresh,
                undefined,
                undefined,
                req,
                res,
            )
        }

    }
    async confirmationEmailController(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | string | any>) {
        const result = await this.authServices.confirmEmail(req.query.code)
        if (result) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED,
                undefined,
                undefined,
                req,
                res,
            )
        } else {
            throw new ErRes(
                INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT,
                undefined,
                undefined,
                req,
                res,
            )
        }
    }
    async registrationConfirmationController(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | string | any>) {
        const result = await this.authServices.confirmEmail(req.body.code)
        if (result) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED,
                undefined,
                undefined,
                req,
                res,
            )
        } else {
            throw new ErRes(
                INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT,
                undefined,
                undefined,
                req,
                res,
            )
        }
    }
    async registrationEmailResendingController(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | number>) {
        const result = await this.authServices.emailResending(req.body.email);
        if (result === null) {
            throw new ErRes(
                INTERNAL_STATUS_CODE.BAD_REQUEST_USER_NOT_FOUND_OR_EMAIL_ALREADY_CONFIRMED,
                undefined,
                undefined,
                req,
                res,
            )
        }
        if (result === false) {
            return new ErRes(
                INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY,
                undefined,
                undefined,
                req,
                res,
            )
        }
        return SuccessResponse(
            INTERNAL_STATUS_CODE.NO_CONTENT,
            undefined,
            undefined,
            req,
            res,
        )
    }
    async passwordRecoveryController(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | number>) {
        // console.log('AuthControllers: - passwordRecoveryController req.body.email', req.body.email)
        const result = await this.userService.ressetPasswordService(req.body.email)
        console.log('AuthControllers: - passwordRecoveryController result', result)

        if (result.status === INTERNAL_STATUS_CODE.SUCCESS) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS,
                undefined,
                `Сообщение успешно отправлено на E-Mail: ${req.params.email}. 
                Проверьте почту и следуйте дальнейшим инструкциям в письме. ${result.expirationDate}`,
                req,
                res
            )
        } else {
            throw new ErRes(
                result.status,
                undefined,
                result.expirationDate,
                req,
                res
            )
        }
    }
    async newPasswordController(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | number>) {
        // console.log('AuthControllers - data 😡',
        //     req.body.login,
        //     req.body.password,
        //     req.body.email
        // )
        const { password, code } = req.body
        if (password && code) {
            const isUpdate = await this.userService.updatePasswordService(password, code)
            if (isUpdate) {
                console.log('UsersController: - newPassword res', isUpdate)
                return SuccessResponse(
                    INTERNAL_STATUS_CODE.SUCCESS_UPDATED_PASSWORD,
                    undefined,
                    undefined,
                    req,
                    res
                )
            } else {
                console.log('UsersController: updatePpassword - isUpdate - ', isUpdate);
                throw new ErRes(Number(isUpdate))
            }
        } else {
            throw new ErRes(
                INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_PASSWORD_CANT_BE_EMPTY,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
    async meController(req: RequestWithParams<CreateUserModel>, res: Response<{ acknowledged: boolean, insertedId: string } | string>) {
        const authUser = await this.authServices.me(String(req.user!.id))
        if (authUser) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS,
                authUser,
                undefined,
                req,
                res,
            )
        } else {
            return new ErRes(
                INTERNAL_STATUS_CODE.USER_NOT_FOUND,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
}
