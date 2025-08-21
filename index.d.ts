import { UserType } from "./src/services/users/Users_DTO/userTypes"

//index.d.ts
declare global {
    namespace Express {
        export interface Request {
            id: string | null
            user?: UserType | null
        }
    }
}
