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
exports.usersRepository = exports.UsersRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../../db");
class UsersRepository {
    createUserRepository(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('usersRepository - user: ', user)
                const createUser = yield db_1.usersCollection.insertOne(user);
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
                return yield db_1.usersCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
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
                return yield db_1.usersCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
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
                return yield db_1.usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    updateConfirmationUserRepository(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_1.usersCollection.updateOne({ _id }, { $set: { 'emailConfirmation.isConfirmed': true } });
            return result.modifiedCount === 1;
        });
    }
}
exports.UsersRepository = UsersRepository;
exports.usersRepository = new UsersRepository();
