import "reflect-metadata"
import { DeleteResult, InsertOneResult, UpdateResult } from "mongodb";
import { UpdateBlogModel } from "./Blogs_DTO/UpdateBlogModel"
import { BlogsRepository } from "./BlogsRepository/blogsRepository";
import { CreateBlogModel } from "./Blogs_DTO/CreateBlogModel";
import { BlogsTypeDB } from "./Blogs_DTO/blogTypes";
import { injectable } from "inversify";

@injectable()
export class BlogsServices {
    constructor(
        // @inject(TYPES.BlogsRepository)
        protected blogsRepository: BlogsRepository,
    ) { }
    async createBlogServices(blog: CreateBlogModel): Promise<InsertOneResult<{ acknowledged: boolean, insertedId: number }> | any> {
        const { name, description, websiteUrl } = blog
        const date = new Date();
        // date.setMilliseconds(0);
        const createdAt = date.toISOString();
        const createBlog = {
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: createdAt,
            isMembership: false
        }
        return await this.blogsRepository.createBlogRepository(createBlog as unknown as BlogsTypeDB)
    }
    async updateBlogServices(id: string, body: UpdateBlogModel): Promise<UpdateResult<{ acknowledged: boolean, insertedId: number }> | any> {
        const updatedBlog = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }
        return await this.blogsRepository.updateBlogRepository(id, updatedBlog)
    }
    async deleteBlogServices(id: string): Promise<DeleteResult | any> {
        return await this.blogsRepository.deleteBlogRepository(id)
    }
}