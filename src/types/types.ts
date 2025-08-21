import { ObjectId, SortDirection } from "mongodb"
import { UserType } from "../services/users/Users_DTO/userTypes";
import { BlogsType } from "../services/blogs/Blogs_DTO/blogTypes";
import { PostType } from "../services/posts/Post_DTO/postType";
import { CommentType } from "../services/comments/Comment_DTO/commentType";

export type sanitizedQueryType = {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: SortDirection;
    searchNameTerm?: string | null;
    searchEmailTerm?: string | null;
    searchLoginTerm?: string | null;
}
export type ProductType = {
    blogs: BlogsType[]
    posts: PostType[]
    users: UserType[]
    content: CommentType[]
}