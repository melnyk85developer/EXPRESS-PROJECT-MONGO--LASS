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
exports.ConfirmationRepository = void 0;
const inversify_1 = require("inversify");
const db_1 = require("../../../db");
const mongodb_1 = require("mongodb");
let ConfirmationRepository = class ConfirmationRepository {
    constructor(mongoDB) {
        this.mongoDB = mongoDB;
    }
    createConfirmationRepository(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('ConfirmationService: - createCo dto: createConfirmationRepository', dto)
                const isCreatedConfirmation = yield this.mongoDB.confirmationCollection.insertOne(Object.assign(Object.assign({}, dto), { confirmationCode: dto.confirmationCode, expirationDate: dto.expirationDate, field: dto.field, userId: dto.userId }));
                // console.log('ConfirmationService: - res isCreatedConfirmation', isCreatedConfirmation)
                return isCreatedConfirmation;
            }
            catch (error) {
                console.error('ConfirmationRepository: - error', error);
                // throw new ErRes(-100, `Ошибка базы данных: createConfirmationRepository: ${error}`, error)
            }
        });
    }
    updateConfirmationRepository(confirmationId, myShopDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { confirmationCode, isBlocked, field, expirationDate, userId } = myShopDto;
            try {
                const updateConfirmation = yield this.mongoDB.confirmationCollection.updateOne({ confirmationCode, isBlocked, field, expirationDate, userId }, { where: { id: confirmationId }, returning: true });
                return updateConfirmation;
            }
            catch (error) {
                console.error('ConfirmationRepository: - error', error);
                // throw new ErRes(-100, `Ошибка базы данных: updateConfirmationRepository: ${error}`, error)
            }
        });
    }
    deleteConfirmationUserIdRepository(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.mongoDB.confirmationCollection.deleteOne({
                    where: { userId: userId },
                });
            }
            catch (error) {
                console.error('ConfirmationRepository: - error', error);
                return null;
                // throw new ErRes(-100, `Ошибка базы данных: deleteConfirmationUserIdRepository: ${error}`, error)
            }
        });
    }
    deleteConfirmationIdRepository(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.mongoDB.confirmationCollection.deleteOne({ where: { id: id } });
            }
            catch (error) {
                console.error('ConfirmationRepository: - error', error);
                return null;
                // throw new ErRes(-100, `Ошибка базы данных: deleteConfirmationUserIdRepository: ${error}`, error)
            }
        });
    }
    findAllConfirmationRepository() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.mongoDB.confirmationCollection.find();
            }
            catch (error) {
                // throw new ErRes(-100, `Ошибка базы данных: findAllConfirmationRepository: ${error}`, error)
            }
        });
    }
    findConfirmationByIdRepository(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('findConfirmationByIdRepository: - _id', _id);
            try {
                const confirmation = yield this.mongoDB.confirmationCollection.findOne({
                    _id: new mongodb_1.ObjectId(_id), // без where
                });
                // console.log('ConfirmationRepository: - findConfirmationByIdRepository confirmation', confirmation);
                return confirmation !== null && confirmation !== void 0 ? confirmation : null;
            }
            catch (error) {
                console.error('ConfirmationRepository: - error', error);
                return null;
            }
        });
    }
    findByUserIdConfirmationRepository(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('findByUserIdConfirmationRepository: - userId', userId);
            try {
                const isConfirmeds = yield this.mongoDB.confirmationCollection
                    .find({ userId: new mongodb_1.ObjectId(userId) })
                    .toArray();
                // console.log('ConfirmationRepository: - findByUserIdConfirmationRepository isConfirmeds', isConfirmeds);
                return isConfirmeds;
            }
            catch (error) {
                console.error('ConfirmationRepository: - error', error);
                return null;
            }
        });
    }
    findByCodeConfirmationRepository(confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.mongoDB.confirmationCollection.findOne({ where: { confirmationCode } });
            }
            catch (error) {
                console.error('ConfirmationRepository: - error', error);
                // throw new ErRes(-100, `Ошибка базы данных: findByCodeConfirmationRepository: ${error}`, error)
            }
        });
    }
};
exports.ConfirmationRepository = ConfirmationRepository;
exports.ConfirmationRepository = ConfirmationRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(db_1.MongoDBCollection)),
    __metadata("design:paramtypes", [db_1.MongoDBCollection])
], ConfirmationRepository);
