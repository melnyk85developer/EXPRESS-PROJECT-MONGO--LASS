import { inject, injectable } from 'inversify';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { INTERNAL_STATUS_CODE } from '../utils/utils';
import { MongoDBCollection } from "../../db";

@injectable()
export class TokenService {
    constructor(
        @inject(MongoDBCollection) private mongoDB: MongoDBCollection
    ) { }

    async generateTokens(payload: any, deviceId: string): Promise<{ accessToken: string; refreshToken: string }> {
        if (!payload || !deviceId) {
            throw new Error('Payload cannot be null or undefined');
        }
        const accessToken = jwt.sign({
            userId: String(payload)
        },
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign({
            userId: String(payload),
            deviceId
        },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: '30d' });

        return { accessToken, refreshToken };
    }
    async validateAccessToken(token: any): Promise<JwtPayload | number | string> {
        // Проверка формата JWT токена
        if (typeof token !== 'string' || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) {
            return INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT;
        }
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
            if (userData) {
                return userData
            } else {
                return INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN;
            }
        } catch (error) {
            // console.error('Ошибка JWT валидации:', error);
            return INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN;
        }
    }
    async validateRefreshToken(refreshToken: any): Promise<JwtPayload | number | string | null> {
        if (typeof refreshToken !== 'string' || !refreshToken) {
            return INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN
        }

        if (!refreshToken || refreshToken.length < 10) {
            return INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT;
        }

        // Проверка формата JWT токена
        if (typeof refreshToken !== 'string' || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(refreshToken)) {
            return INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT;
        }
        try {
            const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);

            if (
                !userData ||
                typeof userData !== 'object' ||
                typeof userData.userId !== 'string' ||
                !/^[a-f\d]{24}$/i.test(userData.userId) // Проверка на ObjectId
            ) {
                // console.error('Ошибка: неверный userId в токене', userData);
                return INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN;
            }

            // console.log('tokenService - validateRefreshToken: ', userData);
            return userData;
        } catch (error) {
            // console.error('Ошибка JWT валидации:', error);f
            return INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN;
        }
    }

    async saveRefreshTokenBlackList(userId: string, refreshToken: string): Promise<boolean | number | any> {
        // console.log('tokenService - saveBlackListToken: refreshToken', refreshToken)
        try {
            const isSave = await this.mongoDB.tokensCollection.insertOne({ userId, refreshToken })
            // console.log('saveRefreshTokenBlackList: - isSave', isSave)
            return isSave

            // if(isSave){
            //     console.log('saveRefreshTokenBlackList: - isSave', isSave)
            //     return isSave.acknowledged
            // }else{
            //     return false
            // }
        } catch (error) {
            // console.error(error)
            return INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST
        }
    }
    async deleteRefreshTokenByTokenInBlackList(refreshToken: string) {
        try {
            const tokenData = await this.mongoDB.tokensCollection.deleteOne({ refreshToken })
            // console.log('deleteRefreshTokenByTokenInBlackList - tokenData', tokenData)
            return tokenData
        } catch (error) {
            console.error(error)
            return null
        }
    }
    async getRefreshTokenByTokenInBlackList(refreshToken: string) {
        try {
            const tokenData = await this.mongoDB.tokensCollection.findOne({ refreshToken })
            // console.log('tokenService getRefreshTokenByTokenInBlackList - tokenData', tokenData)
            return tokenData
        } catch (error) {
            console.error(error)
            return INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST
        }
    }
}