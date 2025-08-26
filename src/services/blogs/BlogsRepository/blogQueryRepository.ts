import "reflect-metadata"
import { ObjectId, SortDirection } from "mongodb";
import { QueryBlogModel } from "../Blogs_DTO/QueryBlogsModel";
import { BlogsType, BlogsTypeDB, ResponseBlogType } from "../Blogs_DTO/blogTypes";
import { RequestWithQuery } from "../../../shared/types/typesGeneric";
import { sanitizedQueryType } from "../../../shared/types/types";
import { injectable } from "inversify";
// import { blogsCollection } from "../../../db";
import { MongoDBCollection } from "../../../db";

@injectable()
export class BlogsQueryRepository {
    constructor(
        // @inject(TYPES.MongoDBCollection)
        private mongoDB: MongoDBCollection
    ) { }
    async getAllBlogsRepository(req: RequestWithQuery<QueryBlogModel> & RequestWithQuery<{ [key: string]: string | undefined }>): Promise<ResponseBlogType | any> {
        const sanitizedQuery: sanitizedQueryType = await this._helper(req.query)
        const totalCount = await this._getBlogsCount(sanitizedQuery)
        const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = sanitizedQuery
        const sortDirectionValue = sortDirection === 'asc' ? 1 : -1
        const filter: any = {}

        try {
            if (searchNameTerm) {
                filter.name = { $regex: searchNameTerm, $options: 'i' }
            }
            const blogs = await this.mongoDB.blogsCollection
                .find(filter)
                .sort({ [sortBy]: sortDirectionValue, _id: 1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray()
            const blogss = await this._arrBlogsMapForRender(sanitizedQuery, blogs, totalCount)
            // console.log('blogsControllers: - getAllBlogsRepository', blogss)

            return blogss
        } catch (error) {
            // console.error(error)
            return error
        }
    }
    async getBlogByIdRepository(id: string): Promise<BlogsType | any> {
        try {
            if (id) {
                const foundBlog = await this.mongoDB.blogsCollection.findOne({ _id: new ObjectId(id) })
                if (foundBlog) { return await this._blogMapForRender(foundBlog) }
            }
            return null
        } catch (error) {
            // console.error(error)
            return error
        }
    }
    async _getBlogsCount(sanitizedQuery: sanitizedQueryType): Promise<number> {
        const filter: any = {};
        const { searchNameTerm } = sanitizedQuery;
        if (searchNameTerm) { filter.name = { $regex: searchNameTerm, $options: 'i' } }
        try {
            return await this.mongoDB.blogsCollection.countDocuments(filter);
        } catch (e) {
            console.error(e);
            return 0;
        }
    }
    async _blogMapForRender(blog: any): Promise<BlogsType> {
        return {
            id: String(blog._id),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership

        }
    }
    async _arrBlogsMapForRender(sanitizedQuery: any, arrBlog: BlogsTypeDB[], totalCount: number): Promise<ResponseBlogType> {
        const resBlogs = []
        for (let i = 0; arrBlog.length > i; i++) {
            let post = await this._blogMapForRender(arrBlog[i])
            resBlogs.push(post)
        }
        return {
            pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
            page: sanitizedQuery.pageNumber,
            pageSize: sanitizedQuery.pageSize,
            totalCount,
            items: resBlogs
        }
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