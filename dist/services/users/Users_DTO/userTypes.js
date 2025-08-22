"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTypeDB = void 0;
class UserTypeDB {
    constructor(_id, accountData, emailConfirmation) {
        this._id = _id;
        this.accountData = accountData;
        this.emailConfirmation = emailConfirmation;
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
