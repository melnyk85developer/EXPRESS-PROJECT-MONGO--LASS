import { ObjectId, SortDirection } from "mongodb";
import { commentsCollection } from "../../../db";
import { RequestWithParams, RequestWithQuery } from "../../../types/typesGeneric";
import { URIParamsOnePostIdAllCommentsModel } from "../Comment_DTO/URIParamsCommentIdModel";
import { sanitizedQueryType } from "../../../types/types";
import { CommentType, CommentTypeDB, ResponseCommentsType } from "../Comment_DTO/commentType";

export const commentsQueryRepository = {
    async getAllCommentssRepository(postId: string, query: any): Promise<ResponseCommentsType | null> {
        // console.log('getAllCommentssRepository: - postId, query', postId, query)
        const sanitizedQuery: sanitizedQueryType = await this._helper(query);
        const totalCount = await this._getCommentsCount(sanitizedQuery, postId);
        const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = sanitizedQuery;
        const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;

        try {
            const filter: any = { postId };
            if (searchNameTerm) {
                filter.content = { $regex: searchNameTerm, $options: 'i' };
            }
            const comments = await commentsCollection
                .find(filter)
                .sort({ [sortBy]: sortDirectionValue, _id: 1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();
            const isComments = await commentsQueryRepository._arrCommentsMapForRender(sanitizedQuery, comments, totalCount);;
            // console.log('getAllCommentssRepository: - isComments', isComments)
            if(isComments && isComments !== undefined){
                // console.log('getAllCommentssRepository: - isComments', isComments)
                return isComments
            }else{
                return null
            }
             
        }catch(e){
            console.error(e);
            return null;
        }
    },
    async getCommentByIdRepository(id: string): Promise<CommentType | any>{
        try{
            const getComment = await commentsCollection.findOne({ _id: new ObjectId(id) }) 
            if(getComment){
                return await commentsQueryRepository._commentsMapForRender(getComment)
            }
        }catch(error){
            // console.error(error)
            return error
        }
    },
    async _getCommentsCount(sanitizedQuery: sanitizedQueryType, postId?: string): Promise<number> {
        const filter: any = {};
        const { searchNameTerm } = sanitizedQuery;
        if (postId){filter.postId = postId}
        if (searchNameTerm) {filter.content = { $regex: searchNameTerm, $options: 'i' };}
        try {
            return await commentsCollection.countDocuments(filter);
        }catch(e) {
            console.error(e);
            return 0;
        }
    },    
    async _commentsMapForRender(comment: CommentTypeDB): Promise<CommentType> {
        const { _id, content, commentatorInfo, createdAt } = comment
        return {
            id: _id,
            content,
            commentatorInfo,
            createdAt,
        }
    },
    async _arrCommentsMapForRender(sanitizedQuery: sanitizedQueryType, arrComment: CommentTypeDB[], totalCount: number): Promise<ResponseCommentsType> {
        const resComments: CommentType[] = [];
        for (let i = 0; i < arrComment.length; i++){
            let comment = await this._commentsMapForRender(arrComment[i]);
            resComments.push(comment);
        }
        return {
            pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
            page: sanitizedQuery.pageNumber,
            pageSize: sanitizedQuery.pageSize,
            totalCount,
            items: resComments
        };
    },
    async _helper(query: {[key: string]: string | undefined}): Promise<sanitizedQueryType> {
        return {
            pageNumber: query.pageNumber ? +query.pageNumber : 1,
            pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
            searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
        }
    }
}