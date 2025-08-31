// import { container } from '../../src/shared/container/iocRoot';
// import { MongoDBCollection } from '../../src/db'
import { SETTINGS } from '../../../shared/settings';
import { HTTP_STATUSES } from '../../../shared/utils/utils';
import { UpdateCommentModel } from '../Comment_DTO/UpdateCommentModel';
import { CreatePostModel } from '../../posts/Post_DTO/CreatePostModel';
import { CreateBlogModel } from '../../blogs/Blogs_DTO/CreateBlogModel';
import { CreateCommentModel } from '../Comment_DTO/CreateCommentModel';
import { authTestManager, getRequest } from '../../../shared/__tests__/managersTests/authTestManager';
import { usersTestManager } from '../../../shared/__tests__/managersTests/usersTestManager';
import { blogsTestManager } from '../../../shared/__tests__/managersTests/blogsTestManager';
import { postsTestManager } from '../../../shared/__tests__/managersTests/postsTestManager';
import { commetsTestManager } from '../../../shared/__tests__/managersTests/commentsTestManager';
import { contextTests } from '../../../shared/__tests__/contextTests';

// const mongoDB: MongoDBCollection = container.resolve(MongoDBCollection)
// const mongoDB: MongoDBCollection = container.get(MongoDBCollection)

export const commentsE2eTest = () => {
    describe('E2E-COMMENTS', () => {
        beforeAll(async () => {
            await getRequest().delete(`${SETTINGS.RouterPath.__test__}/all-data`);
        })
        it('Должен вернуть 200, массив комментариев - should return 200 and comments array', async () => {
            const userData: any = {
                login: contextTests.correctUserName1,
                password: contextTests.correctUserPassword1,
                email: contextTests.correctUserEmail1
            }
            const { createdEntity } = await usersTestManager.createUser(
                userData,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdUser1 = createdEntity;
            const authData = {
                loginOrEmail: contextTests.correctUserName1,
                password: contextTests.correctUserPassword1
            }
            const { accessToken } = await authTestManager.login(
                authData,
                contextTests.userAgent[2],
                HTTP_STATUSES.OK_200
            )
            contextTests.accessTokenUser1Device1 = accessToken
            const blogData = {
                name: contextTests.correctBlogNsme1,
                description: contextTests.correctBlogDescription1,
                websiteUrl: contextTests.correctWebsiteUrl1
            };
            const resData = await blogsTestManager.createBlogs(
                blogData,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            );
            contextTests.createdBlog1 = resData.createdEntity;

            const data: CreatePostModel = {
                title: contextTests.correctTitleBlog1Post1,
                shortDescription: contextTests.shortDescriptionBlog1Post1,
                content: contextTests.contentBlog1Post1,
                blogId: contextTests.createdBlog1.id
            };
            const { response } = await postsTestManager.createPosts(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            );
            contextTests.createdBlog1Post1 = response.body;

            const { getAllComments } = await commetsTestManager.getAllComments(
                contextTests.createdBlog1Post1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getAllComments).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }))
        })
        it('Должен возвращать 404 для несуществующего комментария - should return 404 for a non-existent comment', async () => {
            await commetsTestManager.getCommentById(
                contextTests.invalidId,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`Вы не должны создавать комментарии от неавторизованных пользователей! - You shouldn't create a comment by an unauthorized user!`, async () => {
            const dataComment: CreateCommentModel = {
                content: contextTests.contentBlog1Post1Comment1,
                postId: contextTests.createdBlog1Post1.id
            }
            const { createdComment } = await commetsTestManager.createComment(
                contextTests.createdBlog1Post1.id,
                dataComment,
                contextTests.invalidToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            );
            contextTests.createdBlog1Post1Comment1 = createdComment;
            const { getAllComments } = await commetsTestManager.getAllComments(
                contextTests.createdBlog1Post1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getAllComments).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }))
        })
        it(`Не следует создавать комментарий с невалидными исходными данными - You should not create a post with incorrect initial data`, async () => {
            const data: CreateCommentModel = {
                content: '',
                postId: ''
            }
            await commetsTestManager.createComment(
                contextTests.createdBlog1Post1.id,
                data,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getAllComments } = await commetsTestManager.getAllComments(
                contextTests.createdBlog1Post1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getAllComments).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }))
        })
        it(`Необходимо создать комментарий с правильными исходными данными - it is necessary to create a comment with the correct initial data`, async () => {
            const data: CreateCommentModel = {
                content: contextTests.contentBlog1Post1Comment1,
                postId: contextTests.createdBlog1Post1.id
            };
            const { createdComment } = await commetsTestManager.createComment(
                contextTests.createdBlog1Post1.id,
                data,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdBlog1Post1Comment1 = createdComment
            const { getAllComments } = await commetsTestManager.getAllComments(
                contextTests.createdBlog1Post1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getAllComments).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.createdBlog1Post1Comment1]
                }))
        })
        it(`Создать еще один комментарий - create another comment`, async () => {
            const data: CreateCommentModel = {
                content: contextTests.contentBlog1Post1Comment2,
                postId: contextTests.createdBlog1Post1.id
            }
            const { createdComment } = await commetsTestManager.createComment(
                contextTests.createdBlog1Post1.id,
                data,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdBlog1Post1Comment2 = createdComment
            const { getAllComments } = await commetsTestManager.getAllComments(
                contextTests.createdBlog1Post1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getAllComments).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [contextTests.createdBlog1Post1Comment2, contextTests.createdBlog1Post1Comment1]
                }))
        })
        it(`Не следует обновлять комментарий с невалидными данными. - You should not update a comment with incorrect post data`, async () => {
            const data: UpdateCommentModel = {
                content: '',
                postId: ''
            }
            await commetsTestManager.updateComment(
                contextTests.createdBlog1Post1Comment1.id,
                data,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.BAD_REQUEST_400
            );
            const { getCommentById } = await commetsTestManager.getCommentById(
                contextTests.createdBlog1Post1Comment1.id,
                HTTP_STATUSES.OK_200
            );
            expect(getCommentById).toEqual(
                expect.objectContaining(contextTests.createdBlog1Post1Comment1))

        })
        it(`Не следует обновлять несуществующий комментарий - You should not update a comment that does not exist`, async () => {
            const data: UpdateCommentModel = {
                content: contextTests.contentBlog1Post1Comment1,
                postId: contextTests.createdBlog1Post1.id
            }
            await commetsTestManager.updateComment(
                contextTests.invalidId, 
                data, 
                contextTests.accessTokenUser1Device1, 
                HTTP_STATUSES.NOT_FOUND_404
            );
        })
        it(`Необходимо обновить комментарий с правильными входными данными - should update comment with correct input data`, async () => {
            const updatedComment: UpdateCommentModel = {
                content: contextTests.contentBlog1Post1Comment1,
                postId: contextTests.createdBlog1Post1.id
            }
            await commetsTestManager.updateComment(
                contextTests.createdBlog1Post1Comment1.id, 
                updatedComment, 
                contextTests.accessTokenUser1Device1, 
                HTTP_STATUSES.NO_CONTENT_204
            );
            const { getCommentById } = await commetsTestManager.getCommentById(
                contextTests.createdBlog1Post1Comment1.id, 
                HTTP_STATUSES.OK_200
            )
            expect(getCommentById).toEqual(
                expect.objectContaining({
                    ...contextTests.createdBlog1Post1Comment1,
                    content: updatedComment.content
                })
            )
            const { response } = await commetsTestManager.getCommentById(
                contextTests.createdBlog1Post1Comment2.id, 
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(
                expect.objectContaining(contextTests.createdBlog1Post1Comment2)
            )
        })
        it(`Следует удалить оба комментария - should delete both comments`, async () => {
            await commetsTestManager.deleteComment(
                contextTests.createdBlog1Post1Comment1.id, 
                contextTests.accessTokenUser1Device1, 
                HTTP_STATUSES.NO_CONTENT_204
            )
            await commetsTestManager.getCommentById(
                contextTests.createdBlog1Post1Comment1.id, 
                HTTP_STATUSES.NOT_FOUND_404
            )
            await commetsTestManager.deleteComment(
                contextTests.createdBlog1Post1Comment2.id, 
                contextTests.accessTokenUser1Device1, 
                HTTP_STATUSES.NO_CONTENT_204
            )
            await commetsTestManager.getCommentById(
                contextTests.createdBlog1Post1Comment2.id, 
                HTTP_STATUSES.NOT_FOUND_404
            )
            const { getAllComments } = await commetsTestManager.getAllComments(
                contextTests.createdBlog1Post1.id, 
                HTTP_STATUSES.OK_200
            )
            expect(getAllComments).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }))
        })
        afterAll(done => {
            done();
        });
    });
}

