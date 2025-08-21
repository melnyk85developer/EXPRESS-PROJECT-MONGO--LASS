import { ObjectId } from "mongodb"

export type ResponsePostsType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostType[]
}
export type PostType = {
    id: string | ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
} 
export type PostTypeDB = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}