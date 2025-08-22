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
exports.usersController = exports.UsersControllers = void 0;
const utils_1 = require("../../shared/utils/utils");
const usersQueryRepository_1 = require("./UserRpository/usersQueryRepository");
const usersServices_1 = require("./usersServices");
const ErResSwitch_1 = require("../../shared/utils/ErResSwitch");
const SuccessfulResponse_1 = require("../../shared/utils/SuccessfulResponse");
const createSuperAdminAdapter_1 = require("../../shared/infrastructure/createSuperAdminAdapter");
class UsersControllers {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, email, password } = req.body;
            const superAdmin = yield createSuperAdminAdapter_1.superAdminAdapter.createUser(login, email, password);
            if (superAdmin.accountData.email) {
                const createUser = yield usersServices_1.usersServices.createUserServices(superAdmin);
                if (createUser.acknowledged) {
                    return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_USER, undefined, yield usersQueryRepository_1.usersQueryRepository.getUserByIdRepository(createUser.insertedId));
                }
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, superAdmin);
            }
            return null;
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateUser = yield usersServices_1.usersServices.updateUserServices(req.params.id, req.body);
            if (updateUser && updateUser.acknowledged) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_UPDATED_USER);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_UPDATED_USER);
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield usersQueryRepository_1.usersQueryRepository.getUserByIdRepository(req.params.id);
            if (found) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, found);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, 0, 'Не известная ошибка при получении пользователя!');
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, yield usersQueryRepository_1.usersQueryRepository.getAllUsersRepository(req));
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeletedUser = yield usersServices_1.usersServices.deleteUserServices(req.params.id);
            if (isDeletedUser && isDeletedUser.acknowledged) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_USER);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_USER);
            }
        });
    }
}
exports.UsersControllers = UsersControllers;
exports.usersController = new UsersControllers();
