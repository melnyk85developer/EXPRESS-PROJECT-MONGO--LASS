import "reflect-metadata"
import { DeleteResult, InsertOneResult, UpdateResult } from "mongodb";
import { UpdatePostModel } from "./Post_DTO/UpdatePostModel"
import { CreatePostModel } from "./Post_DTO/CreatePostModel";
import { PostTypeDB } from "./Post_DTO/postType";
import { RequestWithParams } from "../../shared/types/typesGeneric";
import { injectable } from "inversify";
import { BlogsQueryRepository } from "../blogs/BlogsRepository/blogQueryRepository";
import { CommentsRepository } from "../comments/CommentRepository/commentsRepository";
import { CommentsQueryRepository } from "../comments/CommentRepository/commentsQueryRepository";
import { PostsRepository } from "./PostRepository/postsRepository";

@injectable()
export class PostsServices {
    constructor(
        // @inject(TYPES.BlogsQueryRepository)
        protected blogsQueryRepository: BlogsQueryRepository,
        // @inject(TYPES.CommentsRepository)
        protected commentsRepository: CommentsRepository,
        // @inject(TYPES.CommentsQueryRepository)
        protected commentsQueryRepository: CommentsQueryRepository,
        // @inject(TYPES.PostsRepository)
        protected postsRepository: PostsRepository,
    ) { }

    async createPostServices(post: CreatePostModel): Promise<InsertOneResult<{ acknowledged: boolean, insertedId: number }> | null> {
        const { title, shortDescription, content, blogId } = post
        const date = new Date();
        // date.setMilliseconds(0);
        const createdAt = date.toISOString()
        const isIdBlog = await this.blogsQueryRepository.getBlogByIdRepository(blogId)
        const createPost = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: isIdBlog.name,
            createdAt: createdAt
        }
        return await this.postsRepository.createPostRepository(createPost)
    }
    async createPostOneBlogServices(req: RequestWithParams<CreatePostModel>): Promise<InsertOneResult<{ acknowledged: boolean, insertedId: number }> | any> {
        const { blogId } = req.params;
        const { title, shortDescription, content } = req.body;
        const date = new Date();
        // date.setMilliseconds(0);
        const createdAt = date.toISOString();
        const isIdBlog = await this.blogsQueryRepository.getBlogByIdRepository(blogId)
        const createPost = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: isIdBlog.name,
            createdAt: createdAt
        }
        return await this.postsRepository.createPostRepository(createPost as unknown as PostTypeDB)
    }
    async updatePostServices(id: string, body: UpdatePostModel): Promise<UpdateResult<{ acknowledged: boolean, insertedId: number }> | null> {
        const updatedPost = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId
        }
        return await this.postsRepository.updatePostRepository(id, updatedPost)
    }
    async deletePostServices(id: string): Promise<DeleteResult | null> {
        // console.log('deletePostServices: - req id', id)
        const isComments = await this.commentsQueryRepository.getAllCommentssRepository(id, '')
        // console.log('deletePostServices deleteAllComments: - req id, isComments', id, isComments)
        // if(isComments && isComments.items.length > 0){
        // console.log('deleteAllComments: - res id, isComments', id, isComments)
        const commsntExists = await this.commentsRepository.deleteAllCommentsFromPostRepository(id)
        // console.log('deleteAllComments: - res ', id, commsntExists)
        // }
        return await this.postsRepository.deletePostRepository(id)
    }
}