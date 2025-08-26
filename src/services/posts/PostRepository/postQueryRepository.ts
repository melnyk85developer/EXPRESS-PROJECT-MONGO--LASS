import "reflect-metadata"
import { ObjectId, SortDirection } from "mongodb";
import { URIParamsOnePostIdModel, URIParamsPostIdModel } from "../Post_DTO/URIParamsPostIdModel";
import { PostType, PostTypeDB, ResponsePostsType } from "../Post_DTO/postType";
import { RequestWithParams, RequestWithQuery } from "../../../shared/types/typesGeneric";
import { sanitizedQueryType } from "../../../shared/types/types";
import { injectable } from "inversify";
// import { postsCollection } from "../../../db";
import { MongoDBCollection } from "../../../db";

@injectable()
export class PostsQueryRepository {
    constructor(
        // @inject(TYPES.MongoDBCollection)
        private mongoDB: MongoDBCollection,
    ) { }

    async getAllPostsRepositories(req: RequestWithParams<URIParamsOnePostIdModel> & RequestWithQuery<{ [key: string]: string | undefined }>): Promise<ResponsePostsType | null> {
        const { blogId } = req.params;
        const sanitizedQuery: sanitizedQueryType = await this._helper(req.query)
        const totalCount = await this._getPostsCount(sanitizedQuery, blogId);
        const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = sanitizedQuery;
        const sortDirectionValue = sortDirection === 'asc' ? 1 : -1
        const filter: any = {};
        try {
            if (blogId) { filter.blogId = blogId }
            if (searchNameTerm) { filter.title = { $regex: searchNameTerm, $options: 'i' } }
            const posts = await this.mongoDB.postsCollection
                .find(filter)
                .sort({ [sortBy]: sortDirectionValue, _id: 1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();
            return await this._arrPostsMapForRender(sanitizedQuery, posts, totalCount)

        } catch (e) {
            console.error(e);
            return null;
        }
    }
    async getPostByIdRepositories(id: string): Promise<PostType | number | any> {
        // console.log('getPostByIdRepositories - ', id)
        try {
            const getPost = await this.mongoDB.postsCollection.findOne({ _id: new ObjectId(id) })
            // console.log('getPostByIdRepositories - res ', getPost)
            if (getPost) { return await this._postsMapForRender(getPost) }
        } catch (error) {
            return error
        }
    }
    async _getPostsCount(sanitizedQuery: sanitizedQueryType, blogId: string | undefined): Promise<number> {
        const filter: any = {};
        const { searchNameTerm } = sanitizedQuery;
        if (blogId) { filter.blogId = blogId }
        if (searchNameTerm) { filter.title = { $regex: searchNameTerm, $options: 'i' }; }
        try {
            return await this.mongoDB.postsCollection.countDocuments(filter);
        } catch (e) {
            console.error(e);
            return 0;
        }
    }
    async _postsMapForRender(post: PostTypeDB): Promise<PostType> {
        const { _id, title, shortDescription, content, blogId, blogName, createdAt } = post
        return {
            id: _id,
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt,
        }
    }
    async _arrPostsMapForRender(sanitizedQuery: sanitizedQueryType, arrPost: PostTypeDB[], totalCount: number): Promise<ResponsePostsType> {
        const resPosts: PostType[] = [];
        for (let i = 0; i < arrPost.length; i++) {
            let post = await this._postsMapForRender(arrPost[i]);
            resPosts.push(post);
        }
        return {
            pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
            page: sanitizedQuery.pageNumber,
            pageSize: sanitizedQuery.pageSize,
            totalCount,
            items: resPosts
        };
    }
    async _helper(query: { [key: string]: string | undefined }): Promise<sanitizedQueryType> {
        return {
            pageNumber: query.pageNumber ? +query.pageNumber : 1,
            pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
            searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
        }
    }
}