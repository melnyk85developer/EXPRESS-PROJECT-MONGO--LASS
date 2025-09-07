import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "../../../shared/utils/utils";

export const BLOGS_STATUS_POSITIVE = {
    [INTERNAL_STATUS_CODE.SUCCESS_CREATED_BLOG]: {
        messages: { message: 'Успешное создание блога!', field: 'blog' },
        statusCode: HTTP_STATUSES.CREATED_201,
    },
    [INTERNAL_STATUS_CODE.SUCCESS_UPDATED_BLOG]: {
        messages: { message: 'Успешное обновление блога!', field: 'blog' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
    [INTERNAL_STATUS_CODE.SUCCESS_DELETED_BLOG]: {
        messages: { message: 'Блог успешно удален!', field: 'blog' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
}

export const BLOGS_ERRORS = {
    [INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_BLOG_ID]: {
        messages: { message: 'Блога с таким blogId не существует!', field: 'blogId' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_ID]: {
        messages: { message: 'Блога с таким id не существует!', field: 'id' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
}