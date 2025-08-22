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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testsRouter = exports.testsController = exports.TestsController = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../../db");
const utils_1 = require("../../shared/utils/utils");
const ErResSwitch_1 = require("../../shared/utils/ErResSwitch");
class TestsController {
    constructor() {
        this.deleteAllEntity = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteUsersResult = yield db_1.usersCollection.deleteMany({});
                const deleteBlogsResult = yield db_1.blogsCollection.deleteMany({});
                const deletePostsResult = yield db_1.postsCollection.deleteMany({});
                const deleteCommentsResult = yield db_1.commentsCollection.deleteMany({});
                const deleteTokenResult = yield db_1.tokensCollection.deleteMany({});
                const deleteRequestsResult = yield db_1.requestsCollection.deleteMany({});
                const devicesResult = yield db_1.devicesCollection.deleteMany({});
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
}
exports.TestsController = TestsController;
exports.testsController = new TestsController();
exports.testsRouter = express_1.default.Router();
exports.testsRouter.delete('/all-data', exports.testsController.deleteAllEntity);
