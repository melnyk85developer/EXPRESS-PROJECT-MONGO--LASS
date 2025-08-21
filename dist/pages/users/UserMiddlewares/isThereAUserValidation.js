"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdMiddleware = void 0;
const utils_1 = require("../../../utils/utils");
const ErResSwitch_1 = require("../../../utils/ErResSwitch");
const usersServices_1 = require("../usersServices");
const userIdMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const found = yield usersServices_1.usersServices._getUserByIdRepo(req.params.id);
    if (!found) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.USER_NOT_FOUND);
    }
    next();
    return;
});
exports.userIdMiddleware = userIdMiddleware;
