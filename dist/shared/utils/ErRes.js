"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErRes = void 0;
const utils_1 = require("./utils");
const ErrorMessagesAndHttpStatusCode_1 = require("./ErrorMessagesAndHttpStatusCode");
const parseSequelizeError_1 = require("./parseSequelizeError");
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
class ErRes extends Error {
    // Сигнатура не меняем: same args as before
    constructor(statusCode, send, message, req, res) {
        // keep Error behavior
        super(message || (send && send.message) || "Error");
        this.sent = false;
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = "ErRes";
        let status = statusCode;
        // preserve existing -100 parse logic
        if (statusCode === -100) {
            const parse = (0, parseSequelizeError_1.parseDBResponseError)(send);
            if (!(parse && parse.internalCode && parse.message)) {
                status = 404;
                console.error('if -100', parse);
            }
        }
        const errorConfig = ErrorMessagesAndHttpStatusCode_1.ErMsgAndHttpStatusCodeArr[status];
        if (errorConfig) {
            // payload — то, что раньше отправлялось через res
            this.statusCode = errorConfig.statusCode;
            this.payload = send ? send : [errorConfig.messages];
        }
        else {
            this.statusCode = utils_1.HTTP_STATUSES.UNAUTHORIZED_401;
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
            }
            catch (error) {
                // игнорируем ошибку отправки — дальше ошибка попадёт в middleware
                console.error("ErRes: error while sending response inside constructor", error);
            }
        }
    }
}
exports.ErRes = ErRes;
