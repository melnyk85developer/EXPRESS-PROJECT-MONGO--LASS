import { Request, Response, NextFunction } from "express";
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "./utils";
import { ErMessaAndHttpStatusCodeArr } from "./ErrorMessagesAndHttpStatusCode";

export const ResErrorsSwitch = (res: Response, statusCode: number, message?: string, send?: any) => {

    if(statusCode !== -100){
        const responseObject = ErMessaAndHttpStatusCodeArr[statusCode]
        if(responseObject){
            return res
                .status(responseObject.statusCode)
                .json(send ? send : [responseObject.messages]);
        }
    }else{
        console.log('ResErrorsSwitch: - statusCode -100', message, send)
        return res
            .status(HTTP_STATUSES.UNAUTHORIZED_401)
            .json({
                message: `Ошибка: ${message || send}`,
                field: 'Привет из базы данных, -100 statusCode'
            });
    }
    return console.error('ResErrorsSwitch: - Не понятный StatusCode', statusCode, message, send)
}