import { ObjectId, SortDirection } from "mongodb";;
import { URIParamsUserIdModel } from "../Users_DTO/URIParamsUserIdModel";
import { ResponseUserType, UserType, UserTypeDB } from "../Users_DTO/userTypes";
import { RequestWithParams, RequestWithQuery } from "../../../shared/types/typesGeneric";
import { sanitizedQueryType } from "../../../shared/types/types";
import { inject, injectable } from "inversify";
import { MongoDBCollection } from "../../../db";

@injectable()
export class UsersQueryRepository {
    constructor(
        @inject(MongoDBCollection) private mongoDB: MongoDBCollection
    ) { }

    async getAllUsersRepository(req: RequestWithParams<URIParamsUserIdModel> & RequestWithQuery<{ [key: string]: string | undefined }>): Promise<ResponseUserType | null> {
        const sanitizedQuery: sanitizedQueryType = await this._helper(req.query)
        // console.log('sanitizedQuery: ', sanitizedQuery)
        const totalCount = await this._getUsersCount(sanitizedQuery)
        // console.log('totalCount: ', totalCount)
        const { searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize } = sanitizedQuery
        const sortDirectionValue = sortDirection === 'asc' ? 1 : -1
        try {
            // Начинаем с пустого фильтра
            let filter: any = {};

            // Если есть условия для поиска по email или login, добавляем $or
            const orConditions: any[] = [];

            if (searchEmailTerm) {
                orConditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
            }

            if (searchLoginTerm) {
                orConditions.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
            }

            // Только если есть хотя бы одно условие, добавляем оператор $or
            if (orConditions.length > 0) {
                filter.$or = orConditions;
            }

            // console.log('Filter:', filter);

            // Выполняем запрос с корректным фильтром
            const users = await this.mongoDB.usersCollection
                .find(filter)
                .sort({ [sortBy]: sortDirectionValue })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();

            const totalCount = await this.mongoDB.usersCollection.countDocuments(filter);

            const result = await this._arrUsersMapForRender(sanitizedQuery, users, totalCount);
            // console.log('Result:', result);

            return result;

        } catch (e) {
            console.error(e);
            return null;
        }
    }
    async getUserByIdRepository(id: string): Promise<UserType | any> {
        // console.log('getUserByIdRepository: - id', id);
        try {
            const getUser = await this.mongoDB.usersCollection.findOne({ _id: new ObjectId(id) })
            // console.log('getUserByIdRepository: - getUser', getUser);
            if (getUser) {
                return this._userMapForRender(getUser)
            }
        } catch (error) {
            // console.error(error)
            return error
        }
    }
    async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserType | any> {
        try {
            const getUser = await this.mongoDB.usersCollection.findOne({
                $or: [
                    { login: loginOrEmail },
                    { email: loginOrEmail }
                ]
            })
            if (getUser) { return this._userMapForRender(getUser) }
        } catch (error) {
            // console.error(error);
            return error;
        }
        return null;
    }
    async _getUsersCount(sanitizedQuery: sanitizedQueryType): Promise<number> {
        const { searchLoginTerm, searchEmailTerm } = sanitizedQuery;
        let filter: any = {};

        const orConditions: any[] = [];

        if (searchEmailTerm) {
            orConditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
        }

        if (searchLoginTerm) {
            orConditions.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
        }

        if (orConditions.length > 0) {
            filter.$or = orConditions;
        }
        try {
            return await this.mongoDB.usersCollection.countDocuments(filter)
        } catch (error) {
            console.error(error);
            return 0;
        }
    }
    _userMapForRender(user: UserTypeDB): UserType {
        const { accountData } = user
        return {
            id: String(user._id),
            login: accountData.userName,
            email: accountData.email,
            createdAt: accountData.createdAt,
        }
    }
    _arrUsersMapForRender(sanitizedQuery: sanitizedQueryType, arrUsers: UserTypeDB[], totalCount: number): ResponseUserType {
        const resUsers = [];
        for (let i = 0; i < arrUsers.length; i++) {
            let user = this._userMapForRender(arrUsers[i]);
            resUsers.push(user);
        }
        return {
            pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
            page: sanitizedQuery.pageNumber,
            pageSize: sanitizedQuery.pageSize,
            totalCount,
            items: resUsers
        };
    }
    _helper(query: { [key: string]: string | undefined }): sanitizedQueryType {
        return {
            pageNumber: query.pageNumber ? +query.pageNumber : 1,
            pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
            searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
            searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
        }
    }
}