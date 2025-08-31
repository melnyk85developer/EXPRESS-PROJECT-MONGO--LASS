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
exports.TestsController = void 0;
const inversify_1 = require("inversify");
const db_1 = require("../../db");
const ErResSwitch_1 = require("../../shared/utils/ErResSwitch");
let TestsController = class TestsController {
    constructor(mongoDB) {
        this.mongoDB = mongoDB;
        // testsController.ts
        this.deleteAllEntity = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // <<< важно: поднимем коннект, если тесты запускают роут без index.ts
                if (!this.mongoDB.connected) {
                    yield this.mongoDB.connectDB();
                }
                const [u, b, p, c, t, r, d] = yield Promise.all([
                    this.mongoDB.usersCollection.deleteMany({}),
                    this.mongoDB.blogsCollection.deleteMany({}),
                    this.mongoDB.postsCollection.deleteMany({}),
                    this.mongoDB.commentsCollection.deleteMany({}),
                    this.mongoDB.tokensCollection.deleteMany({}),
                    this.mongoDB.requestsCollection.deleteMany({}),
                    this.mongoDB.devicesCollection.deleteMany({}),
                ]);
                if (u.acknowledged && b.acknowledged && p.acknowledged && c.acknowledged &&
                    t.acknowledged && r.acknowledged && d.acknowledged) {
                    return res.sendStatus(204);
                }
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, 400, 'Не удалось удалить данные из базы данных.');
            }
            catch (error) {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, 400, `Ошибка при обнулении базы данных: ${error}`);
            }
        });
    }
    clearAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                this.mongoDB.usersCollection.deleteMany({}),
                this.mongoDB.blogsCollection.deleteMany({}),
                this.mongoDB.postsCollection.deleteMany({}),
                this.mongoDB.commentsCollection.deleteMany({}),
                this.mongoDB.tokensCollection.deleteMany({}),
                this.mongoDB.requestsCollection.deleteMany({}),
                this.mongoDB.devicesCollection.deleteMany({})
            ]);
        });
    }
};
exports.TestsController = TestsController;
exports.TestsController = TestsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(db_1.MongoDBCollection)),
    __metadata("design:paramtypes", [db_1.MongoDBCollection])
], TestsController);
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
