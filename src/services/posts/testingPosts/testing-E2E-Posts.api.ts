import { HTTP_STATUSES } from '../../../shared/utils/utils';
import { CreatePostModel } from '../Post_DTO/CreatePostModel';
import { CreateBlogModel } from '../../blogs/Blogs_DTO/CreateBlogModel';
import { UpdatePostModel } from '../Post_DTO/UpdatePostModel';
import { postsTestManager } from '../../../shared/__tests__/managersTests/postsTestManager';
import { blogsTestManager } from '../../../shared/__tests__/managersTests/blogsTestManager';
import { contextTests } from '../../../shared/__tests__/contextTests';
import { isCreatedUser1 } from '../../users/testingUsers/testFunctionsUser';
import { isLoginUser1 } from '../../auth/testingAuth/testFunctionsAuth';

export const postsE2eTest = () => {
    describe('E2E-POSTS', () => {
        beforeAll(async () => {
            const isUser = await isCreatedUser1(
                contextTests.correctUserName1,
                contextTests.correctUserEmail1,
                contextTests.correctUserPassword1,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const isLogin = await isLoginUser1(
                contextTests.accessTokenUser1Device1,
                contextTests.refreshTokenUser1Device1,
                contextTests.correctUserEmail1,
                contextTests.correctUserPassword1,
                contextTests.userAgent[0],
                HTTP_STATUSES.OK_200
            )
        })
        it('Должен вернуть 200, массив постов - should return 200 and post array', async () => {
            const { getAllPosts } = await postsTestManager.getAllPosts(HTTP_STATUSES.OK_200)
            expect(getAllPosts).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }))
        })
        it('Должен возвращать 404 для несуществующего сообщения - should return 404 for a non-existent post', async () => {
            await postsTestManager.getPostsById(
                contextTests.invalidId,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`Вы не должны создавать посты от неавторизованных пользователей! - You shouldn't create a post by an unauthorized user!`, async () => {
            const data: CreatePostModel = {
                title: contextTests.correctTitleBlog1Post1,
                shortDescription: contextTests.shortDescriptionBlog1Post1,
                content: contextTests.contentBlog1Post1,
                blogId: "1"
            }
            await postsTestManager.createPosts(
                data,
                contextTests.expiredToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            const { getAllPosts } = await postsTestManager.getAllPosts(HTTP_STATUSES.OK_200)
            expect(getAllPosts).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }))
        })
        it(`Не следует создавать пост с неверными исходными данными - You should not create a post with incorrect initial data`, async () => {
            const data: CreatePostModel = {
                title: '',
                shortDescription: '',
                content: '',
                blogId: ''
            }
            await postsTestManager.createPosts(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getAllPosts } = await postsTestManager.getAllPosts(HTTP_STATUSES.OK_200)
            expect(getAllPosts).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }))
        })
        it(`Необходимо создать пост с правильными исходными данными - it is necessary to create a post with the correct initial data`, async () => {
            const blogData = {
                name: contextTests.correctBlogNsme1,
                description: contextTests.correctBlogDescription1,
                websiteUrl: contextTests.correctWebsiteUrl1
            };
            const { bodyBlog } = await blogsTestManager.createBlogs(
                blogData,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            );
            contextTests.createdBlog1 = bodyBlog;

            const data: CreatePostModel = {
                title: contextTests.correctTitleBlog1Post1,
                shortDescription: contextTests.shortDescriptionBlog1Post1,
                content: contextTests.contentBlog1Post1,
                blogId: contextTests.createdBlog1.id
            };
            const { createdEntity } = await postsTestManager.createPosts(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            );
            contextTests.createdBlog1Post1 = createdEntity;
            const { getAllPosts } = await postsTestManager.getAllPosts(HTTP_STATUSES.OK_200)
            expect(getAllPosts).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.createdBlog1Post1]
                }))
        })
        it(`Создать еще один пост - create another post`, async () => {
            const blogData: CreateBlogModel = {
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
                title: contextTests.correctTitleBlog1Post2,
                shortDescription: contextTests.shortDescriptionBlog1Post2,
                content: contextTests.contentBlog1Post2,
                blogId: contextTests.createdBlog1.id
            };
            const { createdEntity } = await postsTestManager.createPosts(data,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201);
            contextTests.createdBlog1Post2 = createdEntity;
            const { getAllPosts } = await postsTestManager.getAllPosts(HTTP_STATUSES.OK_200)
            expect(getAllPosts).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [contextTests.createdBlog1Post2, contextTests.createdBlog1Post1]
                }))
        })
        it(`Не следует обновлять пост с неверными данными. - You should not update a post with incorrect post data`, async () => {
            const data: UpdatePostModel = {
                title: '',
                shortDescription: '',
                content: '',
                blogId: ''
            };
            await postsTestManager.updatePosts(
                contextTests.createdBlog1Post1.id,
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.BAD_REQUEST_400
            );
            const { getPostsById } = await postsTestManager.getPostsById(
                contextTests.createdBlog1Post1.id,
                HTTP_STATUSES.OK_200
            );
            expect(getPostsById).toEqual(
                expect.objectContaining(
                    contextTests.createdBlog1Post1
                )
            )
        })
        it(`Не следует обновлять несуществующий пост - You should not update a post that does not exist`, async () => {
            const data: UpdatePostModel = {
                title: contextTests.correctTitleBlog1Post1,
                shortDescription: contextTests.shortDescriptionBlog1Post1,
                content: contextTests.contentBlog1Post1,
                blogId: contextTests.invalidId
            }
            await postsTestManager.updatePosts(
                contextTests.invalidId,
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.NOT_FOUND_404
            );
        })
        it(`Необходимо обновить пост с правильными входными данными - should update post with correct input data`, async () => {
            const updatedPost: UpdatePostModel = {
                title: contextTests.correctTitleBlog1Post3,
                shortDescription: contextTests.shortDescriptionBlog1Post3,
                content: contextTests.contentBlog1Post3,
                blogId: contextTests.createdBlog1Post1.blogId
            }
            await postsTestManager.updatePosts(
                contextTests.createdBlog1Post1.id,
                updatedPost,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            );
            const { getPostsById } = await postsTestManager.getPostsById(
                contextTests.createdBlog1Post1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getPostsById).toEqual(
                expect.objectContaining({
                    title: updatedPost.title,
                    shortDescription: updatedPost.shortDescription,
                    content: updatedPost.content,
                    blogId: updatedPost.blogId
                }))
            const { response } = await postsTestManager.getPostsById(
                contextTests.createdBlog1Post2.id,
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(
                expect.objectContaining(
                    contextTests.createdBlog1Post2
                )
            )
        })
        it(`Следует удалить оба сообщения - should delete both posts`, async () => {
            await postsTestManager.deletePost(
                contextTests.createdBlog1Post1.id,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            await postsTestManager.getPostsById(
                contextTests.createdBlog1Post1.id,
                HTTP_STATUSES.NOT_FOUND_404
            )
            await postsTestManager.deletePost(
                contextTests.createdBlog1Post2.id,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            await postsTestManager.getPostsById(
                contextTests.createdBlog1Post2.id,
                HTTP_STATUSES.NOT_FOUND_404
            )
            const { getAllPosts } = await postsTestManager.getAllPosts(HTTP_STATUSES.OK_200)
            expect(getAllPosts).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }))
        })
    })
}