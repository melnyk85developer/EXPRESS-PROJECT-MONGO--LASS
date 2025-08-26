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
exports.SuperAdminAdapter = void 0;
require("reflect-metadata");
const uuid = __importStar(require("uuid"));
const date_fns_1 = require("date-fns");
;
const utils_1 = require("../utils/utils");
const inversify_1 = require("inversify");
const usersServices_1 = require("../../services/users/usersServices");
let SuperAdminAdapter = class SuperAdminAdapter {
    constructor(
    // @inject(TYPES.UserService)
    usersServices) {
        this.usersServices = usersServices;
    }
    createUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLogin = yield this.usersServices._getUserByLoginOrEmail(login);
            const isEmail = yield this.usersServices._getUserByLoginOrEmail(email);
            if (!isLogin && !isEmail) {
                const date = new Date();
                // date.setMilliseconds(0)
                const confirmationCode = uuid.v4();
                const createdAt = date.toISOString();
                const createdUser = {
                    accountData: {
                        userName: login,
                        email,
                        password: password,
                        createdAt: createdAt
                    },
                    emailConfirmation: {
                        confirmationCode: confirmationCode,
                        expirationDate: (0, date_fns_1.add)(new Date(), {
                            hours: 1,
                            minutes: 3
                        }),
                        isConfirmed: true
                    }
                };
                return createdUser;
            }
            if (isEmail) {
                return utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_EMAIL_ALREADY_EXISTS;
            }
            if (isLogin) {
                return utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_LOGIN_ALREADY_EXISTS;
            }
        });
    }
};
exports.SuperAdminAdapter = SuperAdminAdapter;
exports.SuperAdminAdapter = SuperAdminAdapter = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [usersServices_1.UserService])
], SuperAdminAdapter);
