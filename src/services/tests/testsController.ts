import { RequestHandler } from 'express';
import { inject, injectable } from 'inversify';
import { MongoDBCollection } from '../../db';
import { HTTP_STATUSES } from '../../shared/utils/utils';
import { ErRes } from '../../shared/utils/ErRes';

@injectable()
export class TestsController {
    constructor(
        @inject(MongoDBCollection) private mongoDB: MongoDBCollection
    ) { }

    private async clearAll() {
        await Promise.all([
            this.mongoDB.usersCollection.deleteMany({}),
            this.mongoDB.blogsCollection.deleteMany({}),
            this.mongoDB.postsCollection.deleteMany({}),
            this.mongoDB.commentsCollection.deleteMany({}),
            this.mongoDB.tokensCollection.deleteMany({}),
            this.mongoDB.requestsCollection.deleteMany({}),
            this.mongoDB.devicesCollection.deleteMany({})
        ])
    }

    // testsController.ts
    deleteAllEntity: RequestHandler = async (req, res) => {
        try {
            // <<< важно: поднимем коннект, если тесты запускают роут без index.ts
            if (!this.mongoDB.connected) {
                await this.mongoDB.connectDB();
            }

            const [u, b, p, c, t, r, d] = await Promise.all([
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
            throw new ErRes(
                400,
                undefined,
                'Не удалось удалить данные из базы данных.',
                req,
                res
            );
        } catch (error) {
            throw new ErRes(
                400,
                undefined,
                `Ошибка при обнулении базы данных: ${error}`,
                req,
                res
            );
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