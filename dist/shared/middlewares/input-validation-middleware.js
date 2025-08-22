"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const inputValidationMiddleware = (req, res, next) => {
    const e = (0, express_validator_1.validationResult)(req);
    if (!e.isEmpty()) {
        const eArray = e.array({ onlyFirstError: true });
        res
            .status(400)
            .json({
            errorsMessages: eArray.map(e => ({
                message: e.msg,
                field: e.path
            }))
        });
    }
    else {
        next();
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
