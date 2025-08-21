import express, {NextFunction, Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import { SETTINGS } from './settings';
import { blogsControllers } from './services/blogs/blogsController';
import { postsControllers } from './services/posts/postControllers';
import { usersControllers } from './services/users/usersControllers';
import { authControllers } from './services/auth/authControllers';
import { testsController } from './services/tests/testsController';
import { commentsControllers } from './services/comments/commentsControllers';
import { secutityControllers } from './services/usersSessions/secutityController';
import { globalRequestLimitMiddleware } from './middlewares/globalRequestLimitMiddleware';

export const app = express()
export const jsonBodyMiddleware = express.json()

app.set('trust proxy', true)
app.use(jsonBodyMiddleware)
app.use(cookieParser())
app.use(globalRequestLimitMiddleware)

app.get('/', (req: Request, res: Response) => {res.send('Hello Samurai')})
app.use(SETTINGS.RouterPath.auth, authControllers())
app.use(SETTINGS.RouterPath.users, usersControllers())
app.use(SETTINGS.RouterPath.blogs, blogsControllers())
app.use(SETTINGS.RouterPath.posts, postsControllers())
app.use(SETTINGS.RouterPath.comments, commentsControllers())
app.use(SETTINGS.RouterPath.security, secutityControllers())
app.use(SETTINGS.RouterPath.__test__, testsController())
