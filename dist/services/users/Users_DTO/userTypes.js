"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTypeDB = void 0;
class UserTypeDB {
    constructor(_id, accountData
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
    ) {
        this._id = _id;
        this.accountData = accountData;
    }
}
exports.UserTypeDB = UserTypeDB;
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
