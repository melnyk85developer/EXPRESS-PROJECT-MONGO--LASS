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
exports.isCreatedUser3 = exports.isCreatedUser2 = exports.isCreatedUser1 = void 0;
const contextTests_1 = require("../../../shared/__tests__/contextTests");
const authTestManager_1 = require("../../../shared/__tests__/managersTests/authTestManager");
const utils_1 = require("../../../shared/utils/utils");
const isCreatedUser1 = (login_1, email_1, password_1, ...args_1) => __awaiter(void 0, [login_1, email_1, password_1, ...args_1], void 0, function* (login, email, password, statusCode = utils_1.HTTP_STATUSES.NO_CONTENT_204) {
    if (!contextTests_1.contextTests.createdUser1) {
        console.log('isCreatedUser1: - contextTests.createdUser1', contextTests_1.contextTests.createdUser1);
        const user = {
            login,
            password,
            email
        };
        const { body, response } = yield authTestManager_1.authTestManager.registration(user, statusCode);
        if (response.status === utils_1.HTTP_STATUSES.NO_CONTENT_204) {
            return true;
        }
        else {
            return body;
        }
    }
    else {
        return null;
    }
});
exports.isCreatedUser1 = isCreatedUser1;
const isCreatedUser2 = (login_1, email_1, password_1, ...args_1) => __awaiter(void 0, [login_1, email_1, password_1, ...args_1], void 0, function* (login, email, password, statusCode = utils_1.HTTP_STATUSES.CREATED_201) {
    if (!contextTests_1.contextTests.createdUser2) {
        const user = {
            login,
            password,
            email
        };
        const { body, response } = yield authTestManager_1.authTestManager.registration(user, statusCode);
        if (response.status === utils_1.HTTP_STATUSES.NO_CONTENT_204) {
            return true;
        }
        else {
            return body;
        }
    }
});
exports.isCreatedUser2 = isCreatedUser2;
const isCreatedUser3 = (login_1, email_1, password_1, ...args_1) => __awaiter(void 0, [login_1, email_1, password_1, ...args_1], void 0, function* (login, email, password, statusCode = utils_1.HTTP_STATUSES.CREATED_201) {
    if (!contextTests_1.contextTests.createdUser3) {
        const user = {
            login,
            password,
            email
        };
        const { body, response } = yield authTestManager_1.authTestManager.registration(user, statusCode);
        console.log('isCreatedUser3: - body', body);
        if (response.status === utils_1.HTTP_STATUSES.NO_CONTENT_204) {
            return true;
        }
        else {
            return body;
        }
    }
});
exports.isCreatedUser3 = isCreatedUser3;
