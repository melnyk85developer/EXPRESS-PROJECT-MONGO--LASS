import express, { RequestHandler } from 'express';
import { blogsCollection, commentsCollection, devicesCollection, postsCollection, requestsCollection, tokensCollection, usersCollection } from '../../db';
import { HTTP_STATUSES } from '../../shared/utils/utils';
import { ResErrorsSwitch } from '../../shared/utils/ErResSwitch';

export class TestsController {
    deleteAllEntity: RequestHandler = async (req, res) => {
        try {
            const deleteUsersResult = await usersCollection.deleteMany({});
            const deleteBlogsResult = await blogsCollection.deleteMany({});
            const deletePostsResult = await postsCollection.deleteMany({});
            const deleteCommentsResult = await commentsCollection.deleteMany({});
            const deleteTokenResult = await tokensCollection.deleteMany({});
            const deleteRequestsResult = await requestsCollection.deleteMany({});
            const devicesResult = await devicesCollection.deleteMany({});

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

export const testsController = new TestsController();
export const testsRouter = express.Router();

testsRouter.delete('/all-data', testsController.deleteAllEntity)