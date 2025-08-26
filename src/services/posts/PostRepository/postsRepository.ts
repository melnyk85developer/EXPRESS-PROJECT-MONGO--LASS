import "reflect-metadata"
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";;
import { UpdatePostModel } from "../Post_DTO/UpdatePostModel";
import { CreatePostModel } from "../Post_DTO/CreatePostModel";
import { injectable } from "inversify";
// import { postsCollection } from "../../../db";
import { MongoDBCollection } from "../../../db";

@injectable()
export class PostsRepository {
    constructor(
        // @inject(TYPES.MongoDBCollection)
        private mongoDB: MongoDBCollection
    ) { }

    async createPostRepository(post: CreatePostModel): Promise<InsertOneResult<{ acknowledged: boolean, insertedId: number }> | null> {
        try {
            return await this.mongoDB.postsCollection.insertOne(post)
        } catch (e) {
            console.error(e)
            return null
        }
    }
    async updatePostRepository(id: string, body: UpdatePostModel): Promise<UpdateResult<{ acknowledged: boolean, insertedId: number }> | null> {
        try {
            const updatedPost = await this.mongoDB.postsCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        title: body.title,
                        shortDescription: body.shortDescription,
                        content: body.content
                    }
                }
            )
            return updatedPost
        } catch (e) {
            console.error(e)
            return null
        }
    }
    async deletePostRepository(id: string): Promise<DeleteResult | null> {
        // console.log('deletePostRepository: - res ', id)
        try {
            return await this.mongoDB.postsCollection.deleteOne({ _id: new ObjectId(id) })
        } catch (e) {
            console.error(e)
            return null
        }
    }
}