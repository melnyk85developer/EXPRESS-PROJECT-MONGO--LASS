import { Container } from 'inversify';
import 'reflect-metadata';
// import { blogsCollection, commentsCollection, devicesCollection, postsCollection, tokensCollection, usersCollection } from '../../db';
import { UsersRepository } from '../../services/users/UserRpository/usersRepository';
import { UsersQueryRepository } from '../../services/users/UserRpository/usersQueryRepository';
import { UserSessionsRepository } from '../../services/usersSessions/UserSessionsRpository/userSessionsRepository';
import { UserSessionsQueryRepository } from '../../services/usersSessions/UserSessionsRpository/userSessionQueryRepository';
import { PostsRepository } from '../../services/posts/PostRepository/postsRepository';
import { PostsQueryRepository } from '../../services/posts/PostRepository/postQueryRepository';
import { CommentsRepository } from '../../services/comments/CommentRepository/commentsRepository';
import { CommentsQueryRepository } from '../../services/comments/CommentRepository/commentsQueryRepository';
import { BlogsQueryRepository } from '../../services/blogs/BlogsRepository/blogQueryRepository';
import { BlogsRepository } from '../../services/blogs/BlogsRepository/blogsRepository';
import { UserService } from '../../services/users/usersServices';
import { SecurityDeviceServices } from '../../services/usersSessions/securityDeviceService';
import { AuthServices } from '../../services/auth/authServices';
import { PostsServices } from '../../services/posts/postsServices';
import { CommentsServices } from '../../services/comments/commentsServices';
import { BlogsServices } from '../../services/blogs/blogsServices';
import { AuthControllers } from '../../services/auth/authControllers';
import { TestsController } from '../../services/tests/testsController';
import { UsersControllers } from '../../services/users/usersControllers';
import { SecurityController } from '../../services/usersSessions/securityController';
import { PostsControllers } from '../../services/posts/postControllers';
import { BlogsControllers } from '../../services/blogs/blogsController';
import { CommentsControllers } from '../../services/comments/commentsControllers';
import { MongoDBCollection } from '../../db';
import { SuperAdminAdapter } from '../infrastructure/createSuperAdminAdapter';
import { TokenService } from '../infrastructure/tokenService';
import { GlobalRequestLimitMiddleware } from '../middlewares/globalRequestLimitMiddleware';
import { SessionsMiddlewares } from '../../services/usersSessions/userSessionsMiddlewares/isThereASessionValidation';
import { UsersMiddlewares } from '../../services/users/UserMiddlewares/isThereAUserValidation';
import { PostsMiddlewares } from '../../services/posts/PostMiddlewares/isThereAPostValidation';
import { СommentsMiddlewares } from '../../services/comments/CommentMiddlewares/isThereACommentValidation';
import { AuthMiddlewares } from '../../services/auth/AuthMiddlewares/authGuardMiddleware';
import { BlogValidationMiddlewares } from '../../services/blogs/BlogsMiddlewares/isThereABlogValidation';
import { TYPES } from './types';
import { app } from '../../app';

export const mongoDBCollection = new MongoDBCollection()

export const usersRepository = new UsersRepository(mongoDBCollection)
export const usersQueryRepository = new UsersQueryRepository(mongoDBCollection)

export const userSessionsRepository = new UserSessionsRepository(mongoDBCollection)
export const userSessionsQueryRepository = new UserSessionsQueryRepository(mongoDBCollection)

export const postsRepository = new PostsRepository(mongoDBCollection)
export const postsQueryRepository = new PostsQueryRepository(mongoDBCollection)
export const commentsRepository = new CommentsRepository(mongoDBCollection)
export const commentsQueryRepository = new CommentsQueryRepository(mongoDBCollection)
export const blogsQueryRepository = new BlogsQueryRepository(mongoDBCollection)
export const blogsRepository = new BlogsRepository(mongoDBCollection)

export const usersServices = new UserService(mongoDBCollection, usersRepository, usersQueryRepository)
export const superAdminAdapter = new SuperAdminAdapter(usersServices)
export const tokenService = new TokenService(mongoDBCollection)
export const securityDeviceServices = new SecurityDeviceServices(userSessionsRepository, tokenService)
export const authServices = new AuthServices(mongoDBCollection, usersServices, usersRepository, usersQueryRepository, securityDeviceServices, tokenService)
export const postsServices = new PostsServices(blogsQueryRepository, commentsRepository, commentsQueryRepository, postsRepository)
export const commentsServices = new CommentsServices(commentsRepository)
export const blogsServices = new BlogsServices(blogsRepository)

export const testsController = new TestsController(mongoDBCollection)
export const authControllers = new AuthControllers(authServices, usersQueryRepository)
export const usersControllers = new UsersControllers(usersQueryRepository, usersServices, superAdminAdapter)
export const securityControllers = new SecurityController(securityDeviceServices, userSessionsQueryRepository)
export const postsControllers = new PostsControllers(postsQueryRepository, commentsServices, commentsQueryRepository, postsServices)
export const blogsControllers = new BlogsControllers(postsQueryRepository, blogsQueryRepository, postsServices, blogsServices)
export const commentsControllers = new CommentsControllers(commentsServices,commentsQueryRepository)


export const globalRequestLimitMiddleware = new GlobalRequestLimitMiddleware(tokenService, mongoDBCollection)
export const sessionsMiddlewares = new SessionsMiddlewares(userSessionsRepository, tokenService)
export const usersMiddlewares = new UsersMiddlewares(usersServices)
export const blogValidationMiddlewares = new BlogValidationMiddlewares(blogsQueryRepository)
export const postsMiddlewares = new PostsMiddlewares(postsQueryRepository)
export const commentsMiddlewares = new СommentsMiddlewares(postsQueryRepository, commentsRepository)
export const authMiddlewares = new AuthMiddlewares(authServices, tokenService, securityDeviceServices, usersQueryRepository)
  
