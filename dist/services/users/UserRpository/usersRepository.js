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
exports.UsersRepository = void 0;
const mongodb_1 = require("mongodb");
;
const inversify_1 = require("inversify");
const db_1 = require("../../../db");
let UsersRepository = class UsersRepository {
    constructor(mongoDB) {
        this.mongoDB = mongoDB;
    }
    createUserRepository(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('usersRepository - user: ', user)
                const createUser = yield this.mongoDB.usersCollection.insertOne(user);
                // console.log('createUserRepository: - ', createUser)
                return createUser;
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    updateUserRepository(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.mongoDB.usersCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                    $set: {
                        'accountData.userName': body.login,
                        'accountData.email': body.email
                    }
                });
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    updateResendingUserRepository(id, confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.mongoDB.usersCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                    $set: {
                        'emailConfirmation.confirmationCode': confirmationCode,
                    }
                });
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    deleteUserRepository(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.mongoDB.usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    updateConfirmationUserRepository(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.mongoDB.usersCollection.updateOne({ _id }, { $set: { 'emailConfirmation.isConfirmed': true } });
            return result.modifiedCount === 1;
        });
    }
    _getUserByIdRepository(id) {
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
    _getUserByLoginOrEmailRepository(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('UsersRepository - loginOrEmail 😡😡😡', loginOrEmail)
            try {
                const getUser = yield this.mongoDB.usersCollection.findOne({
                    $or: [
                        { 'accountData.userName': loginOrEmail },
                        { 'accountData.email': loginOrEmail },
                    ]
                });
                // console.log('UsersRepository: - 😡', getUser)
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
    _getUserByEmailRepository(email) {
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
    _findUserByConfirmationCodeRepository(code) {
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
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(db_1.MongoDBCollection)),
    __metadata("design:paramtypes", [db_1.MongoDBCollection])
], UsersRepository);
