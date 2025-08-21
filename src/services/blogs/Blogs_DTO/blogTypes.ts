import { ObjectId } from "mongodb"

export type ResponseBlogType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogsType[]
}
export type BlogsType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string,
    isMembership: boolean
}
export type BlogsTypeDB = {
    _id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt: string,
    isMembership: boolean
}