export type QueryBlogModel = {
    /**
     * This name should be included in name of found Blog
     */
    searchNameTerm: string | null
    sortBy: string
    sortDirection: string
    pageNumber: number
    pageSize: number

} 