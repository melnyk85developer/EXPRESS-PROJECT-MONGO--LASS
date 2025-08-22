import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { blogsCollection } from "../../../db";
import { UpdateBlogModel } from "../Blogs_DTO/UpdateBlogModel";
import { BlogsTypeDB } from "../Blogs_DTO/blogTypes";

export class BlogsRepository {
    async createBlogRepository(blog: BlogsTypeDB): Promise<InsertOneResult<{ acknowledged: boolean, insertedId: number }> | any> {
        try {
            return await blogsCollection.insertOne(blog)
        } catch (error) {
            // console.error(error)
            return error
        }
    }
    async updateBlogRepository(id: string, blog: UpdateBlogModel): Promise<UpdateResult<{ acknowledged: boolean, insertedId: number }> | any> {
        try {
            const updatedBlog = await blogsCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        name: blog.name,
                        description: blog.description,
                        websiteUrl: blog.websiteUrl
                    }
                }
            );
            return updatedBlog
        } catch (error) {
            // console.error(error)
            return error
        }
    }
    async deleteBlogRepository(id: string): Promise<DeleteResult | any> {
        try {
            return await blogsCollection.deleteOne({ _id: new ObjectId(id) })
        } catch (error) {
            // console.error(error)
            return error
        }
    }
}
export const blogsRepository = new BlogsRepository()