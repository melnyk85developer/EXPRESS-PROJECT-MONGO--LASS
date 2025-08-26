import "reflect-metadata"
import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import { JwtPayload } from 'jsonwebtoken';
import { SETTINGS } from '../settings';
import { ResErrorsSwitch } from '../utils/ErResSwitch';
import { INTERNAL_STATUS_CODE } from '../utils/utils';
import { injectable } from 'inversify';
import { TokenService } from '../infrastructure/tokenService';
// import { requestsCollection } from "../../db";
import { MongoDBCollection } from '../../db';

@injectable()
export class GlobalRequestLimitMiddleware {
    constructor(
        // @inject(TYPES.TokenService)
        private tokenService: TokenService,
        // @inject(TYPES.MongoDBCollection) 
        private mongoDB: MongoDBCollection
    ) { }
    globalRequestLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        if (process.env.NODE_ENV === 'test') {
            next();
            return
        }

        if (req.cookies['refreshToken']) {
            const userToken = await this.tokenService.validateRefreshToken(req.cookies['refreshToken']);
            if (String((userToken as JwtPayload).userId)) {
                // console.log('globalRequestLimitMiddleware: - ', String((userToken as JwtPayload).userId))
                next();
                return
            }
        } else {
            const request = {
                IP: req.ip,
                URL: req.originalUrl,
                date: new Date()
            }
            const tenSecondsAgo = moment(request.date).subtract(SETTINGS.TIME_WINDOW, 'milliseconds').toDate()

            try {
                const filter = {
                    IP: req.ip,
                    URL: req.originalUrl,
                    date: { $gte: tenSecondsAgo }
                }
                const count = await this.mongoDB.requestsCollection.countDocuments(filter);

                if (count >= Number(SETTINGS.MAX_REQUESTS)) {
                    console.log(`IP: ${request.IP}, URL: ${request.URL}, запросов: ${count}`);
                    console.log(`Превышен лимит скорости в globalRequestLimitMiddleware для IP: ${request.IP}, URL: ${request.URL}`)

                    return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_TOO_MANY_REQUESTS)
                }
                const result = await this.mongoDB.requestsCollection.insertOne(request)
                // console.log('Сохранено в базу данных:', result);
            } catch (error) {
                console.error('Ошибка в globalRequestLimitMiddleware:', error);
                return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST, 'Что-то пошло не так при сохранении сессии в базу данных!')
            }
            return next();
        }
    };
}