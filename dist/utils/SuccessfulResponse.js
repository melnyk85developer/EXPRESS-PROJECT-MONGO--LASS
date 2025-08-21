"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessfulResponse = void 0;
const utils_1 = require("./utils");
const ErrorMessagesAndHttpStatusCode_1 = require("./ErrorMessagesAndHttpStatusCode");
const SuccessfulResponse = (res, statusCode, message, send) => {
    const responseObject = ErrorMessagesAndHttpStatusCode_1.SuccessfulResAndHttpStatusCodeArr[statusCode];
    if (responseObject) {
        return res
            .status(responseObject.statusCode)
            .json(send ? send : [responseObject.messages]);
    }
    else {
        return res
            .status(utils_1.HTTP_STATUSES.OK_200)
            .json(send);
    }
};
exports.SuccessfulResponse = SuccessfulResponse;
