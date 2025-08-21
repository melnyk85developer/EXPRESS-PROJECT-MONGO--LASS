import { DeleteResult, InsertOneResult, UpdateResult } from "mongodb";
import { UpdatePostModel } from "./Post_DTO/UpdatePostModel"
import { postsRepository } from "./PostRepository/postsRepository";
import { blogsQueryRepository } from "../blogs/BlogsRepository/blogQueryRepository";
import { CreatePostModel } from "./Post_DTO/CreatePostModel";
import { RequestWithParams } from "../../types/typesGeneric";
import { PostTypeDB } from "./Post_DTO/postType";
import { commentsRepository } from "../comments/CommentRepository/commentsRepository";
import { commentsQueryRepository } from "../comments/CommentRepository/commentsQueryRepository";

export const postsServices = {
    async createPostServices(post: CreatePostModel): Promise<InsertOneResult<{acknowledged: boolean, insertedId: number}> | null> {
        const { title, shortDescription, content, blogId } = post
        const date = new Date();
        // date.setMilliseconds(0);
        const createdAt = date.toISOString()
        const isIdBlog = await blogsQueryRepository.getBlogByIdRepository(blogId)
        const createPost = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: isIdBlog.name,
            createdAt: createdAt
        } 
        return await postsRepository.createPostRepository(createPost)
    },
    async createPostOneBlogServices(req: RequestWithParams<CreatePostModel>): Promise<InsertOneResult<{acknowledged: boolean, insertedId: number}> | any> {
        const { blogId } = req.params;          
        const { title, shortDescription, content } = req.body;
        const date = new Date();
        // date.setMilliseconds(0);
        const createdAt = date.toISOString();
        const isIdBlog = await blogsQueryRepository.getBlogByIdRepository(blogId)
        const createPost = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: isIdBlog.name,
            createdAt: createdAt
        }
        return await postsRepository.createPostRepository(createPost as unknown as PostTypeDB)
    },
    async updatePostServices(id: string, body: UpdatePostModel): Promise<UpdateResult<{acknowledged: boolean, insertedId: number}>  | null> {
        const updatedPost = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId
        }
        return await postsRepository.updatePostRepository(id, updatedPost)
    },
    async deletePostServices(id: string): Promise<DeleteResult | null> {
        // console.log('deletePostServices: - req id', id)
        const isComments = await commentsQueryRepository.getAllCommentssRepository(id, '')
        // console.log('deletePostServices deleteAllComments: - req id, isComments', id, isComments)
        // if(isComments && isComments.items.length > 0){
            // console.log('deleteAllComments: - res id, isComments', id, isComments)
            const commsntExists = await commentsRepository.deleteAllCommentsFromPostRepository(id)
            // console.log('deleteAllComments: - res ', id, commsntExists)
        // }
        return await postsRepository.deletePostRepository(id)
    }
}