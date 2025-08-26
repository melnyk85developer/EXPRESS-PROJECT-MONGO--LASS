"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UsersControllers = void 0;
require("reflect-metadata");
const utils_1 = require("../../shared/utils/utils");
;
const ErResSwitch_1 = require("../../shared/utils/ErResSwitch");
const SuccessfulResponse_1 = require("../../shared/utils/SuccessfulResponse");
const usersQueryRepository_1 = require("./UserRpository/usersQueryRepository");
const usersServices_1 = require("./usersServices");
const createSuperAdminAdapter_1 = require("../../shared/infrastructure/createSuperAdminAdapter");
const inversify_1 = require("inversify");
let UsersControllers = class UsersControllers {
    constructor(usersQueryRepository, usersServices, superAdminAdapter) {
        this.usersQueryRepository = usersQueryRepository;
        this.usersServices = usersServices;
        this.superAdminAdapter = superAdminAdapter;
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, email, password } = req.body;
            const superAdmin = yield this.superAdminAdapter.createUser(login, email, password);
            if (superAdmin.accountData.email) {
                const createUser = yield this.usersServices.createUserServices(superAdmin);
                if (createUser.acknowledged) {
                    return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_USER, undefined, yield this.usersQueryRepository.getUserByIdRepository(createUser.insertedId));
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
            const updateUser = yield this.usersServices.updateUserServices(req.params.id, req.body);
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
            const found = yield this.usersQueryRepository.getUserByIdRepository(req.params.id);
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
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, yield this.usersQueryRepository.getAllUsersRepository(req));
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeletedUser = yield this.usersServices.deleteUserServices(req.params.id);
            if (isDeletedUser && isDeletedUser.acknowledged) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_USER);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_USER);
            }
        });
    }
};
exports.UsersControllers = UsersControllers;
exports.UsersControllers = UsersControllers = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(usersQueryRepository_1.UsersQueryRepository)),
    __param(1, (0, inversify_1.inject)(usersServices_1.UserService)),
    __param(2, (0, inversify_1.inject)(createSuperAdminAdapter_1.SuperAdminAdapter)),
    __metadata("design:paramtypes", [usersQueryRepository_1.UsersQueryRepository,
        usersServices_1.UserService,
        createSuperAdminAdapter_1.SuperAdminAdapter])
], UsersControllers);
