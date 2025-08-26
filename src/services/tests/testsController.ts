import "reflect-metadata"
import express, { RequestHandler } from 'express';
import { TYPES } from '../../shared/container/types';
import { inject, injectable } from 'inversify';
import { MongoDBCollection } from '../../db';
import { HTTP_STATUSES } from '../../shared/utils/utils';
import { ResErrorsSwitch } from '../../shared/utils/ErResSwitch';
// import { blogsCollection, commentsCollection, devicesCollection, postsCollection, requestsCollection, tokensCollection, usersCollection } from "../../db";
import { testsRouter } from "./testsRouts";

@injectable()
export class TestsController {
    constructor(
        // @inject(TYPES.MongoDBCollection)
        private mongoDB: MongoDBCollection
    ) { }

    async clearUsersCollection() {
        return await this.mongoDB.usersCollection.deleteMany({});
    }
    async clearBlogsCollection() {
        return await this.mongoDB.blogsCollection.deleteMany({});
    }
    async clearPostsCollection() {
        return await this.mongoDB.postsCollection.deleteMany({});
    }
    async clearCommentsCollection() {
        return await this.mongoDB.commentsCollection.deleteMany({});
    }
    async clearTokensCollection() {
        return await this.mongoDB.tokensCollection.deleteMany({});
    }
    async clearRequestsCollection() {
        return await this.mongoDB.requestsCollection.deleteMany({});
    }
    async clearDevicesCollection() {
        return await this.mongoDB.devicesCollection.deleteMany({});
    }
    deleteAllEntity: RequestHandler = async (req, res) => {
        try {
            await this.mongoDB.connectDB();

            const deleteUsersResult = await this.clearUsersCollection()
            const deleteBlogsResult = await this.clearBlogsCollection()
            const deletePostsResult = await this.clearPostsCollection()
            const deleteCommentsResult = await this.clearCommentsCollection()
            const deleteTokenResult = await this.clearTokensCollection()
            const deleteRequestsResult = await this.clearRequestsCollection()
            const devicesResult = await this.clearDevicesCollection()

            if (
                deleteBlogsResult.acknowledged &&
                deletePostsResult.acknowledged &&
                deleteUsersResult.acknowledged &&
                deleteCommentsResult.acknowledged &&
                deleteTokenResult.acknowledged &&
                deleteRequestsResult.acknowledged &&
                devicesResult.acknowledged
            ) {
                return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
            }
            return ResErrorsSwitch(res, HTTP_STATUSES.BAD_REQUEST_400, 'Не удалось удалить данные из базы данных.');
        } catch (error) {
            return ResErrorsSwitch(res, HTTP_STATUSES.BAD_REQUEST_400, `Произошла ошибка при попытке обнуления базы данных. ${error}`);
        }
    };
}

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