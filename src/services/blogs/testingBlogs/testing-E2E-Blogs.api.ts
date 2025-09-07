import { HTTP_STATUSES } from "../../../shared/utils/utils";
import { SETTINGS } from '../../../shared/settings';
import { usersTestManager } from '../../../shared/__tests__/managersTests/usersTestManager';
import { authTestManager } from '../../../shared/__tests__/managersTests/authTestManager';
import { blogsTestManager, getRequest } from '../../../shared/__tests__/managersTests/blogsTestManager';
import { contextTests } from '../../../shared/__tests__/contextTests';
import { isCreatedUser1 } from "../../users/testingUsers/testFunctionsUser";
import { isLoginUser1 } from "../../auth/testingAuth/testFunctionsAuth";

export const blogsE2eTest = () => {
    describe('E2E-BLOGS', () => {
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
        it('Должен возвращать 200, а массив блогов - should return 200 and blog array', async () => {
            const { getBlogs } = await blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200)
            expect(getBlogs).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }))
        })
        it('Должен возвращать 404 для несуществующего блога - should return 404 for a non-existent blog', async () => {
            await blogsTestManager.getBlogsById(contextTests.invalidId, HTTP_STATUSES.NOT_FOUND_404)
        })
        it(`Вы не должны создавать блог от неавторизованных пользователей! - You shouldn't create a post by an unauthorized user!`, async () => {
            const data: any = {
                name: contextTests.correctBlogNsme1,
                description: contextTests.correctBlogDescription1,
                websiteUrl: contextTests.correctWebsiteUrl1
            }
            await blogsTestManager.createBlogs(
                data,
                contextTests.expiredToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            await getRequest()
                .get(SETTINGS.RouterPath.blogs)
                .expect(HTTP_STATUSES.OK_200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
        })
        it(`Не стоит создавать блог с неверными исходными данными - You should not create a blog with incorrect initial data`, async () => {
            const data: any = {
                name: '',
                description: '',
                websiteUrl: ''
            }
            await blogsTestManager.createBlogs(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            await getRequest()
                .get(SETTINGS.RouterPath.blogs)
                .expect(HTTP_STATUSES.OK_200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
        })
        it(`Необходимо создать блог с правильными исходными данными - it is necessary to create a blog with the correct initial data`, async () => {
            const data: any = {
                name: contextTests.correctBlogNsme1,
                description: contextTests.correctBlogDescription1,
                websiteUrl: contextTests.correctWebsiteUrl1
            }
            const { createdEntity } = await blogsTestManager.createBlogs(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdBlog1 = createdEntity;
            const { getBlogs } = await blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200)
            expect(getBlogs).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.createdBlog1]
                }))
        })
        it(`Создать еще один блог - create another blog`, async () => {
            const data: any = {
                name: contextTests.correctBlogNsme2,
                description: contextTests.correctBlogDescription2,
                websiteUrl: contextTests.correctWebsiteUrl2
            }
            const { createdEntity } = await blogsTestManager.createBlogs(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdBlog2 = createdEntity;
            const { getBlogs } = await blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200)
            expect(getBlogs).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [contextTests.createdBlog2, contextTests.createdBlog1]
                }))
        })
        it(`Не следует обновлять блог с неверными данными о нем - You should not update a blog with incorrect blog data`, async () => {
            const data: any = {
                name: '',
                description: '',
                websiteUrl: ''
            }
            await blogsTestManager.updateBlogs(
                data,
                contextTests.codedAuth,
                contextTests.createdBlog1.id,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getBlog } = await blogsTestManager.getBlogsById(
                contextTests.createdBlog1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getBlog).toEqual(expect.objectContaining(contextTests.createdBlog1))
        })
        it(`Не стоит обновлять несуществующий блог - You should not update a blog that does not exist`, async () => {
            const data = {
                name: contextTests.correctBlogNsme3,
                description: contextTests.correctBlogDescription3,
                websiteUrl: contextTests.correctWebsiteUrl3
            }
            await blogsTestManager.updateBlogs(
                data,
                contextTests.codedAuth,
                contextTests.invalidId,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`Необходимо обновить блог с правильными исходными данными - should update blog with correct input data`, async () => {
            const data: any = {
                name: contextTests.correctBlogNsme4,
                description: contextTests.correctBlogDescription4,
                websiteUrl: contextTests.correctWebsiteUrl4
            }
            await blogsTestManager.updateBlogs(
                data,
                contextTests.codedAuth,
                contextTests.createdBlog1.id,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getBlog } = await blogsTestManager.getBlogsById(
                contextTests.createdBlog1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getBlog).toEqual(
                expect.objectContaining({
                    name: data.name,
                    description: data.description,
                    websiteUrl: data.websiteUrl
                }))
            const { response } = await blogsTestManager.getBlogsById(
                contextTests.createdBlog2.id,
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(
                expect.objectContaining(contextTests.createdBlog2)
            )
        })
        it(`Должен удалить оба блога - should delete both blog`, async () => {
            await blogsTestManager.deleteBlogs(
                contextTests.createdBlog1.id,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            await blogsTestManager.getBlogsById(
                contextTests.createdBlog1.id,
                HTTP_STATUSES.NOT_FOUND_404
            )
            await blogsTestManager.deleteBlogs(
                contextTests.createdBlog2.id,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            await blogsTestManager.getBlogsById(
                contextTests.createdBlog2.id,
                HTTP_STATUSES.NOT_FOUND_404
            )
            const { getBlogs } = await blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200)
            expect(getBlogs).toEqual(
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