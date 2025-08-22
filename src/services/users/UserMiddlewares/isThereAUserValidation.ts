import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../../shared/utils/utils';
import { ResErrorsSwitch } from '../../../shared/utils/ErResSwitch';
import { usersServices } from '../usersServices';
import { UserTypeDB } from '../Users_DTO/userTypes';

export const userIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const found: UserTypeDB = await usersServices._getUserByIdRepo(req.params.id);
    if(!found){return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.USER_NOT_FOUND)}
    next();
    return
};
