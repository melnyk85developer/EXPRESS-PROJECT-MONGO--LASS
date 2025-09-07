import { ObjectId } from "mongodb"


export class UserTypeDB {
    constructor(
        public _id: ObjectId,
        public accountData: {
            userName: string
            email: string
            password: string
            createdAt: string
        }
        // public confirmations: {
        //     confirmationCode: string,
        //     expirationDate: string,
        //     isConfirmed: boolean,
        //     field: string
        // },
        // public emailConfirmation: {
        //     confirmationCode: string,
        //     expirationDate: string,
        //     isConfirmed: boolean,

        // }
    ) { }

}


export type ResponseUserType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserType[]
}
export type UserType = {
    id: string
    login: string
    email: string
    createdAt: string
}
// export type UserTypeDB = {
//     _id: ObjectId
//     accountData: {
//         userName: string
//         email: string
//         password: string
//         createdAt: string
//     },
//     emailConfirmation: {
//         confirmationCode: string,
//         expirationDate: string,
//         isConfirmed: boolean
//     }
// }
