"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
const dotenv = __importStar(require("dotenv"));
const nodemailer = __importStar(require("nodemailer"));
dotenv.config();
exports.SETTINGS = {
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
    MAX_REQUESTS: process.env.MAX_REQUESTS || 5,
    TIME_WINDOW: process.env.TIME_WINDOW || 10 * 1000,
    PROTECTED_MAX_REQUESTS: process.env.PROTECTED_MAX_REQUESTS || 10,
    PROTECTED_TIME_WINDOW: process.env.PROTECTED_TIME_WINDOW || 10000,
};
