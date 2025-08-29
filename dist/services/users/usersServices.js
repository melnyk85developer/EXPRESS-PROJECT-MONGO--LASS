"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.UserService = void 0;
require("reflect-metadata");
const bcrypt = __importStar(require("bcryptjs"));
const mongodb_1 = require("mongodb");
const userTypes_1 = require("./Users_DTO/userTypes");
const inversify_1 = require("inversify");
let UserService = (() => {
    let _classDecorators = [(0, inversify_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UserService = _classThis = class {
        constructor(mongoDB, usersRepository, usersQueryRepository) {
            this.mongoDB = mongoDB;
            this.usersRepository = usersRepository;
            this.usersQueryRepository = usersQueryRepository;
        }
        createUserServices(user) {
            return __awaiter(this, void 0, void 0, function* () {
                const { accountData, emailConfirmation } = user;
                if (accountData.userName && accountData.password && accountData.email) {
                    let createUser = new userTypes_1.UserTypeDB(new mongodb_1.ObjectId(), {
                        userName: accountData.userName,
                        email: accountData.email,
                        password: yield bcrypt.hash(accountData.password, 10),
                        createdAt: accountData.createdAt
                    }, {
                        confirmationCode: emailConfirmation.confirmationCode,
                        expirationDate: emailConfirmation.expirationDate,
                        isConfirmed: emailConfirmation.isConfirmed
                    });
                    return yield this.usersRepository.createUserRepository(createUser);
                }
            });
        }
        updateUserServices(id, body) {
            return __awaiter(this, void 0, void 0, function* () {
                const updatedUser = {
                    login: body.login,
                    email: body.email
                };
                return yield this.usersRepository.updateUserRepository(id, updatedUser);
            });
        }
        updateResendingUserServices(id, confirmationCode) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.usersRepository.updateResendingUserRepository(id, confirmationCode);
            });
        }
        deleteUserServices(id) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.usersRepository.deleteUserRepository(id);
            });
        }
        _getUserByIdRepo(id) {
            return __awaiter(this, void 0, void 0, function* () {
                // console.log('_getUserByIdRepo: - ', id)
                try {
                    return yield this.mongoDB.usersCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
                }
                catch (error) {
                    // console.error(error)
                    return error;
                }
            });
        }
        _getUserByLoginOrEmail(loginOrEmail) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const getUser = yield this.mongoDB.usersCollection.findOne({
                        $or: [
                            { 'accountData.userName': loginOrEmail },
                            { 'accountData.email': loginOrEmail },
                        ]
                    });
                    if (getUser) {
                        return getUser;
                    }
                }
                catch (error) {
                    // console.error(error);
                    return error;
                }
            });
        }
        _getUserByEmail(email) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const getUser = yield this.mongoDB.usersCollection.findOne({ 'accountData.email': email });
                    if (getUser) {
                        return getUser;
                    }
                }
                catch (error) {
                    // console.error(error);
                    return error;
                }
            });
        }
        _findUserByConfirmationCode(code) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const getUser = yield this.mongoDB.usersCollection.findOne({ 'emailConfirmation.confirmationCode': code });
                    // console.log('_findUserByConfirmationCode - ', getUser)
                    if (getUser) {
                        return getUser;
                    }
                }
                catch (error) {
                    // console.error(error);
                    return error;
                }
            });
        }
    };
    __setFunctionName(_classThis, "UserService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserService = _classThis;
})();
exports.UserService = UserService;
