import { ObjectId } from "mongodb"

export type SessionType = {
    ip: string
    title: string
    deviceId: string
    lastActiveDate: string
}
export type SessionTypeDB = {
    _id: ObjectId
    ip: string
    title: string
    userId: string
    deviceId: string
    lastActiveDate: string
    expirationDate: string
}