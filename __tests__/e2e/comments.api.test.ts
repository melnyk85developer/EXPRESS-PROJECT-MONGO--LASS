import { SETTINGS } from "../../src/settings"
import { postsTestManager } from "./utils/postsTestManager"
import { blogsTestManager } from "./utils/blogsTestManager"
import { usersTestManager } from "./utils/usersTestManager"
import { authTestManager } from "./utils/authTestManager"
import { commetsTestManager, getRequest } from "./utils/commentsTestManager"
import { CreateBlogModel } from "../../src/services/blogs/Blogs_DTO/CreateBlogModel"
import { CreatePostModel } from "../../src/services/posts/Post_DTO/CreatePostModel"
import { CreateCommentModel } from "../../src/services/comments/Comment_DTO/CreateCommentModel"
import { UpdateCommentModel } from "../../src/services/comments/Comment_DTO/UpdateCommentModel"
import { HTTP_STATUSES } from "../../src/shared/utils/utils"

describe('test for /comments', () => {
    const buff2 = Buffer.from(SETTINGS.ADMIN, 'utf8')
    const codedAuth = buff2.toString('base64')
    
    let cookies: string[] = [];
    let createdUser1: any = null
    let createdBlog1: any = null
    let createdPost1: any = null
    let createdComment1: any = null
    let createdBlog2: any = null
    let createdPost2: any = null
    let createdComment2: any = null
    let authToken: any = null
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2FjYzZzMzc3NGI4MDhmMDY0NmVmYyIsImlhdCI6MTczMTkwNjY2MiwiZXhwIjoxNzMxOTkzMDYyfQ.5WhzwZebmRvp5V19TtJAHk3JamPqWp-lxRSGEQKDsXc' 

    beforeAll(async () => {
        await getRequest().delete(`${SETTINGS.RouterPath.__test__}/all-data`);
    })
    it('Должен вернуть 200, массив комментариев - should return 200 and comments array', async () => {
        const userData: any = {
            login: 'MyLogin',
            password: 'password',
            email: 'webmars@mars.com'
        }
        const {createdEntity} = await usersTestManager.createUser(userData, codedAuth, HTTP_STATUSES.CREATED_201)
        createdUser1 = createdEntity;
        const authData = {
            loginOrEmail: "MyLogin",
            password: "password"
        }
        const { accessToken } = await authTestManager.login(authData, `user-agent/comments`, HTTP_STATUSES.OK_200)
        authToken = accessToken
        const blogData: CreateBlogModel = {
            name: 'MyBlog',
            description: 'Description blog',
            websiteUrl: 'https://www.youtube.com/watch?v=ASndlvhI8p0'
        };
        const resData = await blogsTestManager.createBlogs(blogData, codedAuth, HTTP_STATUSES.CREATED_201);
        createdBlog1 = resData.createdEntity;

        const data: CreatePostModel = {
            title: 'My Post Title',
            shortDescription: 'shortDescription',
            content: 'content',
            blogId: resData.createdEntity.id
        };
        const { response } = await postsTestManager.createPosts(data, codedAuth, HTTP_STATUSES.CREATED_201);
        createdPost1 = response.body;

        const { getAllComments } = await commetsTestManager.getAllComments(createdPost1.id, HTTP_STATUSES.OK_200)
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
        await commetsTestManager.getCommentById('66b9413b36f75d0b44ad1c57',HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`Вы не должны создавать комментарии от неавторизованных пользователей! - You shouldn't create a comment by an unauthorized user!`, async () => {
        const dataComment: CreateCommentModel = {
            content: 'the comment',
            postId: createdPost1.id
        }
        const { createdComment } = await commetsTestManager.createComment(createdPost1.id, dataComment, token, HTTP_STATUSES.UNAUTHORIZED_401);
        createdComment1 = createdComment;

        const { getAllComments } = await commetsTestManager.getAllComments(createdPost1.id, HTTP_STATUSES.OK_200)
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
        await commetsTestManager.createComment(createdPost1.id, data, authToken, HTTP_STATUSES.BAD_REQUEST_400)
        const { getAllComments } = await commetsTestManager.getAllComments(createdPost1.id, HTTP_STATUSES.OK_200)
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
            content: 'комментарий test content',
            postId: createdPost1.id
        };
        const { createdComment } = await commetsTestManager.createComment(createdPost1.id, data, authToken, HTTP_STATUSES.CREATED_201)
        createdComment1 = createdComment
        const { getAllComments } = await commetsTestManager.getAllComments(createdPost1.id, HTTP_STATUSES.OK_200)
        expect(getAllComments).toEqual(
            expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdComment1]
            })) 
    })
    it(`Создать еще один комментарий - create another comment`, async () => {
        const data: CreateCommentModel = {
            content: 'комментарий2 test2 content2',
            postId: createdPost1.id
        }
        const { createdComment } = await commetsTestManager.createComment(createdPost1.id, data, authToken, HTTP_STATUSES.CREATED_201)
        createdComment2 = createdComment
        const { getAllComments } = await commetsTestManager.getAllComments(createdPost1.id, HTTP_STATUSES.OK_200)
        expect(getAllComments).toEqual(
            expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [createdComment2, createdComment1]
            })) 
    })
    it(`Не следует обновлять комментарий с невалидными данными. - You should not update a comment with incorrect post data`, async () => {
        const data: UpdateCommentModel = {
            content: '',
            postId: ''
        }
        await commetsTestManager.updateComment(createdComment1.id, data, authToken, HTTP_STATUSES.BAD_REQUEST_400);
        const { getCommentById } = await commetsTestManager.getCommentById(createdComment1.id, HTTP_STATUSES.OK_200);
        // console.log('getCommentById: - ', getCommentById)
        expect(getCommentById).toEqual(
            expect.objectContaining(createdComment1)) 
            
    })
    it(`Не следует обновлять несуществующий комментарий - You should not update a comment that does not exist`, async () => {
        const data: UpdateCommentModel = {
            content: 'content: Не следует обновлять несуществующий комментарий',
            postId: createdPost1.id
        }
        await commetsTestManager.updateComment('66de3dcb9bb517c3d357fc28', data, authToken, HTTP_STATUSES.NOT_FOUND_404);
    })
    it(`Необходимо обновить комментарий с правильными входными данными - should update comment with correct input data`, async () => {
        const updatedComment: UpdateCommentModel = {
            content: 'Content updatedPost lenght > 20',
            postId: createdPost1.id
        }
        await commetsTestManager.updateComment(createdComment1.id, updatedComment, authToken, HTTP_STATUSES.NO_CONTENT_204);
        const {getCommentById} = await commetsTestManager.getCommentById(createdComment1.id, HTTP_STATUSES.OK_200)
        expect(getCommentById).toEqual(
            expect.objectContaining({
                ...createdComment1,
                content: updatedComment.content
            })
        )           
        const {response} = await commetsTestManager.getCommentById(createdComment2.id, HTTP_STATUSES.OK_200)
        expect(response.body).toEqual(expect.objectContaining(createdComment2))
    })
    it(`Следует удалить оба комментария - should delete both comments`, async () => {
        await commetsTestManager.deleteComment(createdComment1.id, authToken, HTTP_STATUSES.NO_CONTENT_204)
        await commetsTestManager.getCommentById(createdComment1.id, HTTP_STATUSES.NOT_FOUND_404)
        await commetsTestManager.deleteComment(createdComment2.id, authToken, HTTP_STATUSES.NO_CONTENT_204)
        await commetsTestManager.getCommentById(createdComment2.id, HTTP_STATUSES.NOT_FOUND_404)
        const { getAllComments } = await commetsTestManager.getAllComments(createdPost1.id, HTTP_STATUSES.OK_200)
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

