import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../../shared/utils/utils';
import { ErRes } from '../../../shared/utils/ErRes';
import { UserTypeDB } from '../Users_DTO/userTypes';
import { injectable, inject } from 'inversify';
import { UserService } from '../usersServices';

@injectable()
export class UsersMiddlewares {
    constructor(
        @inject(UserService) private usersServices: UserService,
    ) { }
    userIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const found: UserTypeDB = await this.usersServices._getUserByIdService(req.params.id);
        if (!found) {
            return new ErRes(
                INTERNAL_STATUS_CODE.USER_NOT_FOUND,
                undefined,
                undefined,
                req,
                res
            )
        }
        next();
        return
    }
}

