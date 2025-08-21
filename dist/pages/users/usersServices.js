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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.usersServices = void 0;
const mongodb_1 = require("mongodb");
const usersRepository_1 = require("./UserRpository/usersRepository");
const db_1 = require("../../db");
const bcrypt = __importStar(require("bcryptjs"));
exports.usersServices = {
    createUserServices(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accountData, emailConfirmation } = user;
            if (accountData.userName && accountData.password && accountData.email) {
                const createUser = {
                    accountData: {
                        userName: accountData.userName,
                        email: accountData.email,
                        password: yield bcrypt.hash(accountData.password, 10),
                        createdAt: accountData.createdAt
                    },
                    emailConfirmation: {
                        confirmationCode: emailConfirmation.confirmationCode,
                        expirationDate: emailConfirmation.expirationDate,
                        isConfirmed: emailConfirmation.isConfirmed
                    }
                };
                // console.log('createUserServices: - ', createUser)
                return yield usersRepository_1.usersRepository.createUserRepository(createUser);
            }
        });
    },
    updateUserServices(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = {
                login: body.login,
                email: body.email
            };
            return yield usersRepository_1.usersRepository.updateUserRepository(id, updatedUser);
        });
    },
    updateResendingUserServices(id, confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersRepository_1.usersRepository.updateResendingUserRepository(id, confirmationCode);
        });
    },
    deleteUserServices(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersRepository_1.usersRepository.deleteUserRepository(id);
        });
    },
    _getUserByIdRepo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('_getUserByIdRepo: - ', id)
            try {
                return yield db_1.usersCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            }
            catch (error) {
                // console.error(error)
                return error;
            }
        });
    },
    _getUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUser = yield db_1.usersCollection.findOne({
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
    },
    _getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUser = yield db_1.usersCollection.findOne({ 'accountData.email': email });
                if (getUser) {
                    return getUser;
                }
            }
            catch (error) {
                // console.error(error);
                return error;
            }
        });
    },
    _findUserByConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUser = yield db_1.usersCollection.findOne({ 'emailConfirmation.confirmationCode': code });
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
