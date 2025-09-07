import { Request, Response, NextFunction } from "express";
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "./utils";
import { ErMsgAndHttpStatusCodeArr } from "./ErrorMessagesAndHttpStatusCode";
import { parseDBResponseError } from "./parseSequelizeError";

// export const ErRes = (res: Response, statusCode: number, message?: string, send?: any) => {

//     if(statusCode !== -100){
//         const responseObject = ErMsgAndHttpStatusCodeArr[statusCode]
//         if(responseObject){
//             return res
//                 .status(responseObject.statusCode)
//                 .json(send ? send : [responseObject.messages]);
//         }
//     }else{
//         console.log('ErRes: - statusCode -100', message, send)
//         return res
//             .status(HTTP_STATUSES.UNAUTHORIZED_401)
//             .json({
//                 message: `Ошибка: ${message || send}`,
//                 field: 'Привет из базы данных, -100 statusCode'
//             });
//     }
//     return console.error('ErRes: - Не понятный StatusCode', statusCode, message, send)
// }

export class ErRes extends Error {
    public statusCode: number;
    public payload: any;
    public sent: boolean = false;

    // Сигнатура не меняем: same args as before
    constructor(statusCode: number, send?: any, message?: string, req?: any, res?: any) {
        // keep Error behavior
        super(message || (send && send.message) || "Error");
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = "ErRes";

        let status = statusCode;

        // preserve existing -100 parse logic
        if (statusCode === -100) {
            const parse = parseDBResponseError(send);
            if (!(parse && parse.internalCode && parse.message)) {
                status = 404;
                console.error('if -100', parse);
            }
        }

        const errorConfig = ErMsgAndHttpStatusCodeArr[status];

        if (errorConfig) {
            // payload — то, что раньше отправлялось через res
            this.statusCode = errorConfig.statusCode;
            this.payload = send ? send : [errorConfig.messages];
        } else {
            this.statusCode = HTTP_STATUSES.UNAUTHORIZED_401;
            this.payload = {
                message: `Ошибка: ${message || send}`,
                field: 'unknown'
            };
        }

        // Если передан res — отправляем ответ прямо сейчас, НО НИКОГДА не return res!
        if (res && typeof res.status === "function") {
            try {
                // Отправляем и помечаем, что уже отправляли — чтобы middleware не дублял ответ
                res.status(this.statusCode).json(this.payload);
                this.sent = true;
            } catch (error) {
                // игнорируем ошибку отправки — дальше ошибка попадёт в middleware
                console.error("ErRes: error while sending response inside constructor", error);
            }
        }
    }
}