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
exports.AuthControllers = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const utils_1 = require("../../shared/utils/utils");
const ErResSwitch_1 = require("../../shared/utils/ErResSwitch");
const SuccessfulResponse_1 = require("../../shared/utils/SuccessfulResponse");
const uuid = __importStar(require("uuid"));
let AuthControllers = (() => {
    let _classDecorators = [(0, inversify_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuthControllers = _classThis = class {
        constructor(
        // @inject(AuthServices)
        authServices, 
        // @inject(TYPES.UsersQueryRepository)
        usersQueryRepository) {
            this.authServices = authServices;
            this.usersQueryRepository = usersQueryRepository;
        }
        registrationController(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                // console.log('AuthControllers - data 😡',
                //     req.body.login,
                //     req.body.password,
                //     req.body.email
                // )
                const result = yield this.authServices.registrationServices(req.body.login, req.body.password, req.body.email);
                console.log('AuthControllers - registration: - result ', result);
                if (result.insertedId) {
                    const foundUser = yield this.usersQueryRepository.getUserByIdRepository(result.insertedId);
                    if (foundUser) {
                        return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.NO_CONTENT);
                    }
                }
                else {
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, result);
                }
            });
        }
        loginControllers(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                // @ts-ignore
                // console.log('authControllers: login - userId', String(req.user._id))
                let ip;
                let title;
                req.ip ? ip = req.ip : ip = `There's no ip address on the darknet`;
                req.headers['user-agent'] ? title = req.headers['user-agent'] : title = `device unknown='${uuid.v4()}'`;
                // @ts-ignore
                const result = yield this.authServices.loginServices(String(req.user._id), ip, title);
                // console.log('authControllers: result - ', result)
                if (result) {
                    res
                        .cookie('refreshToken', result.refreshToken, {
                        maxAge: 30 * 24 * 60 * 60 * 1000,
                        httpOnly: true,
                        secure: true,
                    })
                        .header('Authorization', `Bearer ${result.accessToken}`)
                        .status(utils_1.HTTP_STATUSES.OK_200)
                        .json({ "accessToken": result.accessToken });
                }
            });
        }
        logoutControllers(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                // console.log('authControllers: - logout', String(req.user!.id))
                const isLogout = yield this.authServices.logoutServices(String(req.user.id), req.cookies.refreshToken);
                if (isLogout) {
                    res.clearCookie('refreshToken', { httpOnly: true });
                    return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.NO_CONTENT);
                }
                else {
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST);
                }
            });
        }
        refreshControllers(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                // console.log('authControllers: - refresh-token', String(req.user!.id))
                const isRefresh = yield this.authServices.refreshTokenOrSessionService(req.ip ? req.ip : `There's no ip address on the darknet`, req.headers['user-agent'] ? req.headers['user-agent'] : `device unknown='${uuid.v4()}'`, String(req.user.id), req.cookies['refreshToken']);
                if (isRefresh === utils_1.INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND) {
                    // console.log('authControllers: - isRefresh', isRefresh)
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST);
                }
                if (isRefresh.refreshToken) {
                    return res
                        .cookie('refreshToken', isRefresh.refreshToken, {
                        maxAge: 30 * 24 * 60 * 60 * 1000,
                        httpOnly: true,
                        secure: true,
                    })
                        .status(utils_1.HTTP_STATUSES.OK_200)
                        .json({ "accessToken": isRefresh.accessToken });
                }
                else {
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, isRefresh);
                }
            });
        }
        confirmationEmailControllers(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield this.authServices.confirmEmail(req.query.code);
                if (result) {
                    return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED);
                }
                else {
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT);
                }
            });
        }
        registrationConfirmationControllers(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield this.authServices.confirmEmail(req.body.code);
                if (result) {
                    return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED);
                }
                else {
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT);
                }
            });
        }
        registrationEmailResendingControllers(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield this.authServices.emailResending(req.body.email);
                if (result === null) {
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_USER_NOT_FOUND_OR_EMAIL_ALREADY_CONFIRMED);
                }
                if (result === false) {
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY);
                }
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.NO_CONTENT);
            });
        }
        meControllers(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const authUser = yield this.authServices.me(String(req.user.id));
                if (authUser) {
                    return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, '', authUser);
                }
                else {
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.USER_NOT_FOUND);
                }
            });
        }
    };
    __setFunctionName(_classThis, "AuthControllers");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthControllers = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthControllers = _classThis;
})();
exports.AuthControllers = AuthControllers;
