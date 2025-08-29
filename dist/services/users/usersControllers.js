"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersControllers = void 0;
require("reflect-metadata");
const utils_1 = require("../../shared/utils/utils");
;
const ErResSwitch_1 = require("../../shared/utils/ErResSwitch");
const SuccessfulResponse_1 = require("../../shared/utils/SuccessfulResponse");
const inversify_1 = require("inversify");
let UsersControllers = (() => {
    let _classDecorators = [(0, inversify_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UsersControllers = _classThis = class {
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
    __setFunctionName(_classThis, "UsersControllers");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsersControllers = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsersControllers = _classThis;
})();
exports.UsersControllers = UsersControllers;
