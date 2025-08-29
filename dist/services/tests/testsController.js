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
exports.TestsController = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const utils_1 = require("../../shared/utils/utils");
const ErResSwitch_1 = require("../../shared/utils/ErResSwitch");
let TestsController = (() => {
    let _classDecorators = [(0, inversify_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TestsController = _classThis = class {
        constructor(
        // @inject(TYPES.MongoDBCollection)
        mongoDB) {
            this.mongoDB = mongoDB;
            this.deleteAllEntity = (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.mongoDB.connectDB();
                    const deleteUsersResult = yield this.clearUsersCollection();
                    const deleteBlogsResult = yield this.clearBlogsCollection();
                    const deletePostsResult = yield this.clearPostsCollection();
                    const deleteCommentsResult = yield this.clearCommentsCollection();
                    const deleteTokenResult = yield this.clearTokensCollection();
                    const deleteRequestsResult = yield this.clearRequestsCollection();
                    const devicesResult = yield this.clearDevicesCollection();
                    if (deleteBlogsResult.acknowledged &&
                        deletePostsResult.acknowledged &&
                        deleteUsersResult.acknowledged &&
                        deleteCommentsResult.acknowledged &&
                        deleteTokenResult.acknowledged &&
                        deleteRequestsResult.acknowledged &&
                        devicesResult.acknowledged) {
                        return res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
                    }
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.HTTP_STATUSES.BAD_REQUEST_400, 'Не удалось удалить данные из базы данных.');
                }
                catch (error) {
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.HTTP_STATUSES.BAD_REQUEST_400, `Произошла ошибка при попытке обнуления базы данных. ${error}`);
                }
            });
        }
        clearUsersCollection() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.mongoDB.usersCollection.deleteMany({});
            });
        }
        clearBlogsCollection() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.mongoDB.blogsCollection.deleteMany({});
            });
        }
        clearPostsCollection() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.mongoDB.postsCollection.deleteMany({});
            });
        }
        clearCommentsCollection() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.mongoDB.commentsCollection.deleteMany({});
            });
        }
        clearTokensCollection() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.mongoDB.tokensCollection.deleteMany({});
            });
        }
        clearRequestsCollection() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.mongoDB.requestsCollection.deleteMany({});
            });
        }
        clearDevicesCollection() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.mongoDB.devicesCollection.deleteMany({});
            });
        }
    };
    __setFunctionName(_classThis, "TestsController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TestsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TestsController = _classThis;
})();
exports.TestsController = TestsController;
// export const testsController = () => {
//     const router = express.Router()
//     router.delete('/all-data', async (req, res) => {
//         console.log('testsController: - 😡')
//         try {
//             const deleteUsersResult = await usersCollection.deleteMany({});
//             const deleteBlogsResult = await blogsCollection.deleteMany({});
//             const deletePostsResult = await postsCollection.deleteMany({});
//             const deleteCommentsResult = await commentsCollection.deleteMany({});
//             const deleteTokenResult = await tokensCollection.deleteMany({});
//             const deleteRequestsResult = await requestsCollection.deleteMany({});
//             const devicesResult = await devicesCollection.deleteMany({});
//             if (deleteBlogsResult.acknowledged
//                 && deletePostsResult.acknowledged
//                 && deleteUsersResult.acknowledged
//                 && deleteCommentsResult.acknowledged
//                 && deleteTokenResult.acknowledged
//                 && deleteRequestsResult.acknowledged
//                 && devicesResult.acknowledged) {
//                 res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
//             } else {
//                 return ResErrorsSwitch(res, HTTP_STATUSES.BAD_REQUEST_400, `Не удалось удалить данные из базы данных.`)
//             }
//         } catch (error) {
//             return ResErrorsSwitch(res, HTTP_STATUSES.BAD_REQUEST_400, `Произошла ошибка при попытке обнуления базы данных. ${error}`)
//         }
//     });
//     return router
// }
