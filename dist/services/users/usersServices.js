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
const bcrypt = __importStar(require("bcryptjs"));
const mongodb_1 = require("mongodb");
const userTypes_1 = require("./Users_DTO/userTypes");
const inversify_1 = require("inversify");
const usersRepository_1 = require("./UserRpository/usersRepository");
const usersQueryRepository_1 = require("./UserRpository/usersQueryRepository");
let UserService = class UserService {
    constructor(usersRepository, usersQueryRepository) {
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
    _getUserByIdService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('_getUserByIdRepo: - ', id)
            try {
                return yield this.usersRepository._getUserByIdRepository(id);
            }
            catch (error) {
                // console.error(error)
                return error;
            }
        });
    }
    _getUserByLoginOrEmailService(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('UserService - loginOrEmail 😡😡', loginOrEmail)
            return yield this.usersRepository._getUserByLoginOrEmailRepository(loginOrEmail);
        });
    }
    _getUserByEmailService(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersRepository._getUserByEmailRepository;
        });
    }
    _findUserByConfirmationCodeService(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersRepository._findUserByConfirmationCodeRepository(code);
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(usersRepository_1.UsersRepository)),
    __param(1, (0, inversify_1.inject)(usersQueryRepository_1.UsersQueryRepository)),
    __metadata("design:paramtypes", [usersRepository_1.UsersRepository,
        usersQueryRepository_1.UsersQueryRepository])
], UserService);
