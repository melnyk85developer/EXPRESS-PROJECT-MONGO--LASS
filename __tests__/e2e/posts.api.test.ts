import { SETTINGS } from "../../src/settings"
import { getRequest, postsTestManager } from "./utils/postsTestManager"
import { blogsTestManager } from "./utils/blogsTestManager"
import { usersTestManager } from "./utils/usersTestManager"
import { authTestManager } from "./utils/authTestManager"
import { CreatePostModel } from "../../src/services/posts/Post_DTO/CreatePostModel"
import { CreateBlogModel } from "../../src/services/blogs/Blogs_DTO/CreateBlogModel"
import { UpdatePostModel } from "../../src/services/posts/Post_DTO/UpdatePostModel"
import { HTTP_STATUSES } from "../../src/shared/utils/utils"


describe('test for /posts', () => {
    const buff2 = Buffer.from(SETTINGS.ADMIN, 'utf8')
    const codedAuth = buff2.toString('base64')
    let cookies: string[] = [];
    let createdUser1: any = null
    let authToken: any = null

    beforeAll(async () => {
        await getRequest().delete(`${SETTINGS.RouterPath.__test__}/all-data`);
    })
    it('Должен вернуть 200, массив сообщений - should return 200 and post array', async () => {
        const userData: any = {
            login: 'MyLogin',
            password: 'password',
            email: 'webmars@mars.com'
        }
        // console.log("TEST: - codedAuth", codedAuth)
        const {createdEntity} = await usersTestManager.createUser(userData, 
            // authToken, 
            codedAuth,
            HTTP_STATUSES.CREATED_201)
        createdUser1 = createdEntity;
        const authData = {
            loginOrEmail: "MyLogin",
            password: "password"
        }
        const { accessToken } = await authTestManager.login(authData, `user-agent/posts`, HTTP_STATUSES.OK_200)
        authToken = accessToken
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
        await postsTestManager.getPostsById('66b9413b36f75d0b44ad1c57',HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`Вы не должны создавать посты от неавторизованных пользователей! - You shouldn't create a post by an unauthorized user!`, async () => {
        const data: CreatePostModel = {
            title: "MyPost",
            shortDescription: "MyPost - shortDescription",
            content: "content content content content content",
            blogId: "1"
        };
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoicGFzc3dvcmQiLCJ1c2VySWQiOiI2NzJhMzdmMDkzZDUzMjFmNGZjNjE5M2UiLCJpYXQiOjE3MzA4MjAwODUsImV4cCI6MTczMDgyMDk4NX0.lpZlmruicYbzJ_y3k8rkyAYWnFlpwEhjG2e1K6jFGSk'

        await postsTestManager.createPosts(data, token, HTTP_STATUSES.UNAUTHORIZED_401)

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
        await postsTestManager.createPosts(data, 
            // authToken, 
            codedAuth,
            HTTP_STATUSES.BAD_REQUEST_400)
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
    let createdPost1: any = null
    let createdBlog1: any = null
    it(`Необходимо создать пост с правильными исходными данными - it is necessary to create a post with the correct initial data`, async () => {
        const blogData: CreateBlogModel = {
            name: 'MyBlog',
            description: 'Description blog',
            websiteUrl: 'https://www.youtube.com/watch?v=ASndlvhI8p0'
        };
        const resData = await blogsTestManager.createBlogs(blogData, 
            // authToken, 
            codedAuth,
            HTTP_STATUSES.CREATED_201);
        createdBlog1 = resData.createdEntity;

        const data: CreatePostModel = {
            title: 'My Post Title',
            shortDescription: 'shortDescription',
            content: 'content',
            blogId: resData.createdEntity.id
        };
        const { createdEntity } = await postsTestManager.createPosts(data, 
            // authToken,
            codedAuth, 
            HTTP_STATUSES.CREATED_201);
        createdPost1 = createdEntity;
        const { getAllPosts } = await postsTestManager.getAllPosts(HTTP_STATUSES.OK_200)
        expect(getAllPosts).toEqual(
            expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdPost1]
            })) 
    })
    let createdPost2: any = null
    let createdBlog2: any = null
    it(`Создать еще один пост - create another post`, async () => {
        const blogData: CreateBlogModel = {
            name: 'MyBlog',
            description: 'Description blog',
            websiteUrl: 'https://www.youtube.com/watch?v=ASndlvhI8p0'
        };
        const resData = await blogsTestManager.createBlogs(blogData, 
            // authToken, 
            codedAuth,
            HTTP_STATUSES.CREATED_201);
        createdBlog2 = resData.createdEntity;

        const data: CreatePostModel = {
            title: 'My Post Title - createdPost2',
            shortDescription: 'shortDescription Blog - createdPost2',
            content: 'https://-bGYGzbDUI8THxDvfX9-wi3',
            blogId: resData.createdEntity.id
        };
        const { createdEntity } = await postsTestManager.createPosts(data, 
            // authToken, 
            codedAuth,
            HTTP_STATUSES.CREATED_201);
        createdPost2 = createdEntity;
        const { getAllPosts } = await postsTestManager.getAllPosts(HTTP_STATUSES.OK_200)
        expect(getAllPosts).toEqual(
            expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [createdPost2, createdPost1]
            })) 
    })
    it(`Не следует обновлять пост с неверными данными. - You should not update a post with incorrect post data`, async () => {
        const data: UpdatePostModel = {
            title: '',
            shortDescription: '',
            content: '',
            blogId: ''
        };
        await postsTestManager.updatePosts(createdPost1.id, data, 
            // authToken, 
            codedAuth,
            HTTP_STATUSES.BAD_REQUEST_400);
        const { getPostsById } = await postsTestManager.getPostsById(createdPost1.id, HTTP_STATUSES.OK_200);
        expect(getPostsById).toEqual(
            expect.objectContaining(createdPost1)) 
            
    })
    it(`Не следует обновлять несуществующий пост - You should not update a post that does not exist`, async () => {
        const data: UpdatePostModel = {
            title: 'My Post Title',
            shortDescription: 'shortDescription Blog',
            content: 'https://-bUI8THxDvfX9-wi3',
            blogId: '66de3dcb9bb517c3d357fc28'
        }
        await postsTestManager.updatePosts('66de3dcb9bb517c3d357fc28', data, 
            // authToken, 
            codedAuth,
            HTTP_STATUSES.NOT_FOUND_404);
    })
    it(`Необходимо обновить пост с правильными входными данными - should update post with correct input data`, async () => {
        const updatedPost: UpdatePostModel = {
            title: 'Aleksandra Title',
            shortDescription: 'Aleksandra shortDescription',
            content: 'Aleksandra content',
            blogId: createdPost1.blogId
        }
        await postsTestManager.updatePosts(createdPost1.id, updatedPost, 
            // authToken,
            codedAuth, 
            HTTP_STATUSES.NO_CONTENT_204);
        const {getPostsById} = await postsTestManager.getPostsById(createdPost1.id, HTTP_STATUSES.OK_200)
        expect(getPostsById).toEqual(
            expect.objectContaining({
                title: updatedPost.title,
                shortDescription: updatedPost.shortDescription,
                content: updatedPost.content,
                blogId: updatedPost.blogId
            })) 
        const {response} = await postsTestManager.getPostsById(createdPost2.id, HTTP_STATUSES.OK_200)
        expect(response.body).toEqual(expect.objectContaining(createdPost2))
    })
    it(`Следует удалить оба сообщения - should delete both posts`, async () => {
        await postsTestManager.deletePost(createdPost1.id, 
            // authToken, 
            codedAuth, 
            HTTP_STATUSES.NO_CONTENT_204)
        await postsTestManager.getPostsById(createdPost1.id, HTTP_STATUSES.NOT_FOUND_404)
        await postsTestManager.deletePost(createdPost2.id, 
            // authToken, 
            codedAuth,
            HTTP_STATUSES.NO_CONTENT_204)
        await postsTestManager.getPostsById(createdPost2.id, HTTP_STATUSES.NOT_FOUND_404)
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
    afterAll(done => {
        done();
    });
});

