import {SETTINGS} from "../../src/settings";
import { HTTP_STATUSES } from "../../src/shared/utils/utils";
import { authTestManager } from "./utils/authTestManager";
import { blogsTestManager, getRequest } from "./utils/blogsTestManager";
import { usersTestManager } from "./utils/usersTestManager";

describe('test for /blogs', () => {
    const buff2 = Buffer.from(SETTINGS.ADMIN, 'utf8')
    const codedAuth = buff2.toString('base64')

    let cookies: string[] = []
    let createdUser1: any = null
    let authToken: any = null

    beforeAll(async () => {
        await getRequest().delete(`${SETTINGS.RouterPath.__test__}/all-data`)
    })
    it('Должен возвращать 200, а массив блогов - should return 200 and blog array', async () => {
        const userData: any = {
            login: 'MyLogin',
            password: 'password',
            email: 'webmars@mars.com'
        }
        const {createdEntity} = await usersTestManager.createUser(userData, 
            // authToken,
            codedAuth, 
            HTTP_STATUSES.CREATED_201)
        createdUser1 = createdEntity;
        const authData = {
            loginOrEmail: "MyLogin",
            password: "password"
        }
        const { accessToken } = await authTestManager.login(authData, `user-agent/blogs`, HTTP_STATUSES.OK_200)
        authToken = accessToken
        const { getBlogs } = await blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200)
        // console.log('authToken: - authToken', authToken)
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
        await blogsTestManager.getBlogsById('66b9413d36f75d0b44ad1c5a', HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`Вы не должны создавать блог от неавторизованных пользователей! - You shouldn't create a post by an unauthorized user!`, async () => {
        const data: any = {
            name: 'SUPER BLOG - Вася',
            description: 'Описание Вася',
            websiteUrl: 'https://webmars.com' 
        }
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoicGFzc3dvcmQiLCJ1c2VySWQiOiI2NzJhMzdmMDkzZDUzMjFmNGZjNjE5M2UiLCJpYXQiOjE3MzA4MjAwODUsImV4cCI6MTczMDgyMDk4NX0.lpZlmruicYbzJ_y3k8rkyAYWnFlpwEhjG2e1K6jFGSk'
        
        await blogsTestManager.createBlogs(data, token, HTTP_STATUSES.UNAUTHORIZED_401)
        await getRequest()
            .get(SETTINGS.RouterPath.blogs)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items:[]
            })
    })
    it(`Не стоит создавать блог с неверными исходными данными - You should not create a blog with incorrect initial data`, async () => {
        const data: any = {
            name: '',
            description: '',
            websiteUrl: ''
        }

        await blogsTestManager.createBlogs(data, 
            // authToken, 
            codedAuth,
            HTTP_STATUSES.BAD_REQUEST_400)
        await getRequest()
            .get(SETTINGS.RouterPath.blogs)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items:[]
            })
    })
    let createdBlog1: any = null
    it(`Необходимо создать блог с правильными исходными данными - it is necessary to create a blog with the correct initial data`, async () => {
        const data: any = {
            name: 'MyBlog',
            description: 'Description blog',
            websiteUrl: 'https://webmars.com'
        }
        const {createdEntity} = await blogsTestManager.createBlogs(data, 
            // authToken, 
            codedAuth,
            HTTP_STATUSES.CREATED_201)
        createdBlog1 = createdEntity;
        const { getBlogs } = await blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200)
        expect(getBlogs).toEqual(
            expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdBlog1]
            })) 
    })
    let createdBlog2: any = null
    it(`Создать еще один блог - create another blog`, async () => {
        const data: any = {
            name: 'ViktorBlog',
            description: 'Description ViktorBlog',
            websiteUrl: 'https://webmars.com'
        }
        const {createdEntity} = await blogsTestManager.createBlogs(data, 
            // authToken, 
            codedAuth,
            HTTP_STATUSES.CREATED_201)
        createdBlog2 = createdEntity;
        const { getBlogs } = await blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200)
        expect(getBlogs).toEqual(
            expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [createdBlog2, createdBlog1]
            }))
    })
    it(`Не следует обновлять блог с неверными данными о нем - You should not update a blog with incorrect blog data`, async () => {
        const data: any = {
            name: '',
            description: '',
            websiteUrl: ''
        }
        await blogsTestManager.updateBlogs(data, 
            // authToken, 
            codedAuth,
            createdBlog1.id, HTTP_STATUSES.BAD_REQUEST_400)
        const { getBlog } = await blogsTestManager.getBlogsById(createdBlog1.id, HTTP_STATUSES.OK_200)
        expect(getBlog).toEqual(expect.objectContaining(createdBlog1)) 
    })
    it(`Не стоит обновлять несуществующий блог - You should not update a blog that does not exist`, async () => {
        const data = {
            name: 'NataliBlog', 
            description: 'description', 
            websiteUrl: 'https://webmars.com'
        }
        await blogsTestManager.updateBlogs(data, 
            // authToken, 
            codedAuth,
            '66de3dcb9bb517c3d357fc28', HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`Необходимо обновить блог с правильными исходными данными - should update blog with correct input data`, async () => {
        const data: any = {
            name: 'AleksandraBlog',
            description: 'Description AleksandraBlog',
            websiteUrl: 'https://webmars.com' 
        }
        await blogsTestManager.updateBlogs(data, 
            // authToken, 
            codedAuth,
            createdBlog1.id, HTTP_STATUSES.NO_CONTENT_204)
        const {getBlog} = await blogsTestManager.getBlogsById(createdBlog1.id, HTTP_STATUSES.OK_200)
        expect(getBlog).toEqual(
            expect.objectContaining({
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            })) 
        const {response} = await blogsTestManager.getBlogsById(createdBlog2.id, HTTP_STATUSES.OK_200)
        expect(response.body).toEqual(expect.objectContaining(createdBlog2))
    })
    it(`Должен удалить оба блога - should delete both blog`, async () => {
        await blogsTestManager.deleteBlogs(createdBlog1.id, 
            // authToken, 
            codedAuth,
            HTTP_STATUSES.NO_CONTENT_204)
        await blogsTestManager.getBlogsById(createdBlog1.id, HTTP_STATUSES.NOT_FOUND_404)
        await blogsTestManager.deleteBlogs(createdBlog2.id, 
            // authToken, 
            codedAuth,
            HTTP_STATUSES.NO_CONTENT_204)
        await blogsTestManager.getBlogsById(createdBlog2.id, HTTP_STATUSES.NOT_FOUND_404)
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
    afterAll(done => {
        done()
    })
})

// .set('Cookie', cookies ? cookies : []) // Устанавливаем куку, если она есть