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
exports.UsersQueryRepository = void 0;
require("reflect-metadata");
const mongodb_1 = require("mongodb");
;
const inversify_1 = require("inversify");
let UsersQueryRepository = (() => {
    let _classDecorators = [(0, inversify_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UsersQueryRepository = _classThis = class {
        constructor(
        // @inject(TYPES.MongoDBCollection)
        mongoDB) {
            this.mongoDB = mongoDB;
        }
        getAllUsersRepository(req) {
            return __awaiter(this, void 0, void 0, function* () {
                const sanitizedQuery = yield this._helper(req.query);
                // console.log('sanitizedQuery: ', sanitizedQuery)
                const totalCount = yield this._getUsersCount(sanitizedQuery);
                // console.log('totalCount: ', totalCount)
                const { searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize } = sanitizedQuery;
                const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;
                try {
                    // Начинаем с пустого фильтра
                    let filter = {};
                    // Если есть условия для поиска по email или login, добавляем $or
                    const orConditions = [];
                    if (searchEmailTerm) {
                        orConditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
                    }
                    if (searchLoginTerm) {
                        orConditions.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
                    }
                    // Только если есть хотя бы одно условие, добавляем оператор $or
                    if (orConditions.length > 0) {
                        filter.$or = orConditions;
                    }
                    // console.log('Filter:', filter);
                    // Выполняем запрос с корректным фильтром
                    const users = yield this.mongoDB.usersCollection
                        .find(filter)
                        .sort({ [sortBy]: sortDirectionValue })
                        .skip((pageNumber - 1) * pageSize)
                        .limit(pageSize)
                        .toArray();
                    const totalCount = yield this.mongoDB.usersCollection.countDocuments(filter);
                    const result = yield this._arrUsersMapForRender(sanitizedQuery, users, totalCount);
                    // console.log('Result:', result);
                    return result;
                }
                catch (e) {
                    console.error(e);
                    return null;
                }
            });
        }
        getUserByIdRepository(id) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const getUser = yield this.mongoDB.usersCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
                    if (getUser) {
                        return this._userMapForRender(getUser);
                    }
                }
                catch (error) {
                    // console.error(error)
                    return error;
                }
            });
        }
        getUserByLoginOrEmail(loginOrEmail) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const getUser = yield this.mongoDB.usersCollection.findOne({
                        $or: [
                            { login: loginOrEmail },
                            { email: loginOrEmail }
                        ]
                    });
                    if (getUser) {
                        return this._userMapForRender(getUser);
                    }
                }
                catch (error) {
                    // console.error(error);
                    return error;
                }
                return null;
            });
        }
        _getUsersCount(sanitizedQuery) {
            return __awaiter(this, void 0, void 0, function* () {
                const { searchLoginTerm, searchEmailTerm } = sanitizedQuery;
                let filter = {};
                const orConditions = [];
                if (searchEmailTerm) {
                    orConditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
                }
                if (searchLoginTerm) {
                    orConditions.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
                }
                if (orConditions.length > 0) {
                    filter.$or = orConditions;
                }
                try {
                    return yield this.mongoDB.usersCollection.countDocuments(filter);
                }
                catch (error) {
                    console.error(error);
                    return 0;
                }
            });
        }
        _userMapForRender(user) {
            const { accountData } = user;
            return {
                id: String(user._id),
                login: accountData.userName,
                email: accountData.email,
                createdAt: accountData.createdAt,
            };
        }
        _arrUsersMapForRender(sanitizedQuery, arrUsers, totalCount) {
            const resUsers = [];
            for (let i = 0; i < arrUsers.length; i++) {
                let user = this._userMapForRender(arrUsers[i]);
                resUsers.push(user);
            }
            return {
                pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
                page: sanitizedQuery.pageNumber,
                pageSize: sanitizedQuery.pageSize,
                totalCount,
                items: resUsers
            };
        }
        _helper(query) {
            return {
                pageNumber: query.pageNumber ? +query.pageNumber : 1,
                pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
                sortBy: query.sortBy ? query.sortBy : 'createdAt',
                sortDirection: query.sortDirection ? query.sortDirection : 'desc',
                searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
                searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
            };
        }
    };
    __setFunctionName(_classThis, "UsersQueryRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsersQueryRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsersQueryRepository = _classThis;
})();
exports.UsersQueryRepository = UsersQueryRepository;
