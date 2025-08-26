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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.UserService = void 0;
require("reflect-metadata");
const bcrypt = __importStar(require("bcryptjs"));
const mongodb_1 = require("mongodb");
const userTypes_1 = require("./Users_DTO/userTypes");
const inversify_1 = require("inversify");
const usersRepository_1 = require("./UserRpository/usersRepository");
const usersQueryRepository_1 = require("./UserRpository/usersQueryRepository");
// import { usersCollection } from '../../db';
const db_1 = require("../../db");
let UserService = class UserService {
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
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(db_1.MongoDBCollection)),
    __param(1, (0, inversify_1.inject)(usersRepository_1.UsersRepository)),
    __param(2, (0, inversify_1.inject)(usersQueryRepository_1.UsersQueryRepository)),
    __metadata("design:paramtypes", [db_1.MongoDBCollection,
        usersRepository_1.UsersRepository,
        usersQueryRepository_1.UsersQueryRepository])
], UserService);
