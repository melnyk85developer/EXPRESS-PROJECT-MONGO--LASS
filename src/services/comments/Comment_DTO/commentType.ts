export type ResponseCommentsType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentType[]
}
export type CommentType = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
} 
export type CommentTypeDB = {
    _id: string,
    postId: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}