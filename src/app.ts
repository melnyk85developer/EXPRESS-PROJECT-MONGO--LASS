import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { SETTINGS } from './settings';
import { testsRouter } from './services/tests/testsController';
import { globalRequestLimitMiddleware } from './shared/middlewares/globalRequestLimitMiddleware';
import { usersRouter } from './services/users/usersRouts';
import { authRouter } from './services/auth/authRouts';
import { blogsRouter } from './services/blogs/blogsRouts';
import { postRouter } from './services/posts/postsRouts';
import { commentsRouter } from './services/comments/commentsRouts';
import { securityRouter } from './services/usersSessions/securityRouts';

export const app = express()
export const jsonBodyMiddleware = express.json()

app.set('trust proxy', true)
app.use(jsonBodyMiddleware)
app.use(cookieParser())
app.use(globalRequestLimitMiddleware)

app.get('/', (req: Request, res: Response) => {res.send('Hello Samurai')})
app.use(SETTINGS.RouterPath.auth, authRouter)
app.use(SETTINGS.RouterPath.users, usersRouter)
app.use(SETTINGS.RouterPath.blogs, blogsRouter)
app.use(SETTINGS.RouterPath.posts, postRouter)
app.use(SETTINGS.RouterPath.comments, commentsRouter)
app.use(SETTINGS.RouterPath.security, securityRouter)
app.use(SETTINGS.RouterPath.__test__, testsRouter)
