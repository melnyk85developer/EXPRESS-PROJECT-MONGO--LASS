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
exports.UsersQueryRepository = void 0;
require("reflect-metadata");
const mongodb_1 = require("mongodb");
;
const inversify_1 = require("inversify");
// import { usersCollection } from '../../../db';
const db_1 = require("../../../db");
let UsersQueryRepository = class UsersQueryRepository {
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
exports.UsersQueryRepository = UsersQueryRepository;
exports.UsersQueryRepository = UsersQueryRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [db_1.MongoDBCollection])
], UsersQueryRepository);
