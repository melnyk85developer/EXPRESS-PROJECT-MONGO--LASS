"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResErrorsSwitch = void 0;
const utils_1 = require("./utils");
const ErrorMessagesAndHttpStatusCode_1 = require("./ErrorMessagesAndHttpStatusCode");
const ResErrorsSwitch = (res, statusCode, message, send) => {
    if (statusCode !== -100) {
        const responseObject = ErrorMessagesAndHttpStatusCode_1.ErMessaAndHttpStatusCodeArr[statusCode];
        if (responseObject) {
            return res
                .status(responseObject.statusCode)
                .json(send ? send : [responseObject.messages]);
        }
    }
    else {
        console.log('ResErrorsSwitch: - statusCode -100', message, send);
        return res
            .status(utils_1.HTTP_STATUSES.UNAUTHORIZED_401)
            .json({
            message: `Ошибка: ${message || send}`,
            field: 'Привет из базы данных, -100 statusCode'
        });
    }
    return console.error('ResErrorsSwitch: - Не понятный StatusCode', statusCode, message, send);
};
exports.ResErrorsSwitch = ResErrorsSwitch;
