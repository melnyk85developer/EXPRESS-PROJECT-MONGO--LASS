"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponse = void 0;
const ErRes_1 = require("./ErRes");
const ErrorMessagesAndHttpStatusCode_1 = require("./ErrorMessagesAndHttpStatusCode");
const SuccessResponse = (statusCode, send, message, req, res) => {
    // if (send && send.resFileName && send.resFilePath) {
    //     if (!res) {
    //         throw new Error('No response context available for file streaming 😡');
    //     }
    //     res.type(send.resFileName);
    //     res.setHeader(
    //         'Content-Disposition',
    //         `inline; filename*=UTF-8''${encodeURIComponent(send.resFileName)}`
    //     );
    //     // ВАЖНО: при стриминге файлов ничего больше не возвращаем!
    //     return res.sendFile(send.resFilePath);
    // }
    // console.log('SuccessResponse: статус и данные перед отправкой', statusCode, send, message);
    const responseTemplate = ErrorMessagesAndHttpStatusCode_1.SuccessfulResAndHttpStatusCodeArr[statusCode];
    if (send && statusCode !== 204) {
        // console.log('SuccessResponse: send - ', send);
        return res
            .status(responseTemplate.statusCode)
            .json(send ? send : [responseTemplate.messages]);
    }
    if (responseTemplate && responseTemplate.statusCode === 204) {
        // console.log('SuccessResponse: - IF 204', responseTemplate.statusCode)
        res.status(responseTemplate.statusCode);
    }
    if (responseTemplate && statusCode !== 204) {
        // console.log('SuccessResponse: responseTemplate - IF', responseTemplate)
        const msg = responseTemplate.messages.message + message;
        return res
            .status(responseTemplate.statusCode)
            .json(send ? send : msg);
    }
    else {
        throw new ErRes_1.ErRes(statusCode, undefined, undefined, req, res);
    }
};
exports.SuccessResponse = SuccessResponse;
