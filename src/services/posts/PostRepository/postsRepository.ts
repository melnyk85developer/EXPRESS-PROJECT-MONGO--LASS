import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { postsCollection } from "../../../db";
import { UpdatePostModel } from "../Post_DTO/UpdatePostModel";
import { CreatePostModel } from "../Post_DTO/CreatePostModel";

export const postsRepository = {
    async createPostRepository(post: CreatePostModel): Promise<InsertOneResult<{acknowledged: boolean, insertedId: number}>  | null> {
        try {
            return await postsCollection.insertOne(post) 
        }catch(e){
            console.error(e)
            return null
        }
    },
    async updatePostRepository(id: string, body: UpdatePostModel): Promise<UpdateResult<{acknowledged: boolean, insertedId: number}>  | null> {
        try {
            const updatedPost = await postsCollection.updateOne(
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
        }catch(e){
            console.error(e)
            return null
        }
    },
    async deletePostRepository(id: string): Promise<DeleteResult | null> {
        // console.log('deletePostRepository: - res ', id)
        try {
            return await postsCollection.deleteOne({_id: new ObjectId(id)})
        }catch(e){
            console.error(e)
            return null
        }  
    }
}