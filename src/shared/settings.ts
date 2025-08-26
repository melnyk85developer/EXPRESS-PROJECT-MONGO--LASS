import * as dotenv from 'dotenv'
import * as nodemailer from 'nodemailer';
dotenv.config();

export const SETTINGS = {
    RouterPath: {
        auth: '/auth',
        registration: '/registration',
        login: '/login',
        me: '/me',
        users: '/users',
        blogs: '/blogs',
        posts: '/posts',
        comments: '/comments',
        security: '/security',
        devices: '/devices',
        __test__: '/testing'
    },
    Nodemailer: {
        transport: nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        })
    },
    USER: process.env.USER || 'user:qwerty',
    ADMIN: process.env.ADMIN_AUTH || 'admin:qwerty',

    MAX_REQUESTS: process.env.MAX_REQUESTS || 5 ,
    TIME_WINDOW: process.env.TIME_WINDOW || 10 * 1000 ,

    PROTECTED_MAX_REQUESTS: process.env.PROTECTED_MAX_REQUESTS || 10 ,
    PROTECTED_TIME_WINDOW: process.env.PROTECTED_TIME_WINDOW || 10000 ,
    
}