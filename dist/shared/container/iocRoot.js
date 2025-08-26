"use strict";
// import 'reflect-metadata';
// import { Container } from 'inversify';
// import { TYPES } from './types';
// // import { MongoDBCollection } from '../../db';
// // import { TestsController } from '../../services/tests/testsController';
// import { UsersRepository } from '../../services/users/UserRpository/usersRepository';
// import { AuthServices } from '../../services/auth/authServices';
// import { AuthControllers } from '../../services/auth/authControllers';
// import { TokenService } from '../infrastructure/tokenService';
// import { UserService } from '../../services/users/usersServices';
// import { UsersQueryRepository } from '../../services/users/UserRpository/usersQueryRepository';
// import { UsersControllers } from '../../services/users/usersControllers';
// import { SuperAdminAdapter } from '../infrastructure/createSuperAdminAdapter';
// import { UserSessionsRepository } from '../../services/usersSessions/UserSessionsRpository/userSessionsRepository';
// import { UserSessionsQueryRepository } from '../../services/usersSessions/UserSessionsRpository/userSessionQueryRepository';
// import { BlogsServices } from '../../services/blogs/blogsServices';
// import { BlogsRepository } from '../../services/blogs/BlogsRepository/blogsRepository';
// import { BlogsQueryRepository } from '../../services/blogs/BlogsRepository/blogQueryRepository';
// import { BlogsControllers } from '../../services/blogs/blogsController';
// import { PostsControllers } from '../../services/posts/postControllers';
// import { PostsServices } from '../../services/posts/postsServices';
// import { PostsRepository } from '../../services/posts/PostRepository/postsRepository';
// import { PostsQueryRepository } from '../../services/posts/PostRepository/postQueryRepository';
// import { CommentsRepository } from '../../services/comments/CommentRepository/commentsRepository';
// import { CommentsQueryRepository } from '../../services/comments/CommentRepository/commentsQueryRepository';
// import { CommentsServices } from '../../services/comments/commentsServices';
// import { CommentsControllers } from '../../services/comments/commentsControllers';
// import { SecurityController } from '../../services/usersSessions/securityController';
// import { SecurityDeviceServices } from '../../services/usersSessions/securityDeviceService';
// import { MongoDBCollection } from '../../db';
// import { GlobalRequestLimitMiddleware } from '../middlewares/globalRequestLimitMiddleware';
// import { SessionsMiddlewares } from '../../services/usersSessions/userSessionsMiddlewares/isThereASessionValidation';
// import { UsersMiddlewares } from '../../services/users/UserMiddlewares/isThereAUserValidation';
// import { BlogValidationMiddlewares } from '../../services/blogs/BlogsMiddlewares/isThereABlogValidation';
// import { PostsMiddlewares } from '../../services/posts/PostMiddlewares/isThereAPostValidation';
// import { СommentsMiddlewares } from '../../services/comments/CommentMiddlewares/isThereACommentValidation';
// import { AuthMiddlewares } from '../../services/auth/AuthMiddlewares/authGuardMiddleware';
// import { TestsController } from '../../services/tests/testsController';
// // import { testsController } from '../../services/tests/testsController';
// export const container = new Container();
// // DB
// // container.bind(MongoDBCollection).to(MongoDBCollection)
// // MIDDLEWARE
// container.bind(GlobalRequestLimitMiddleware).to(GlobalRequestLimitMiddleware)
// // auth
// container.bind(AuthControllers).to(AuthControllers)
// container.bind(AuthServices).to(AuthServices)
// container.bind(TokenService).to(TokenService)
// // MIDDLEWARE
// container.bind(AuthMiddlewares).to(AuthMiddlewares)
// // users
// container.bind(UsersControllers).to(UsersControllers)
// container.bind(UserService).to(UserService)
// container.bind(UsersRepository).to(UsersRepository)
// container.bind(UsersQueryRepository).to(UsersQueryRepository)
// container.bind(SuperAdminAdapter).to(SuperAdminAdapter)
// // MIDDLEWARE
// container.bind(UsersMiddlewares).to(UsersMiddlewares)
// // SESSIONS
// container.bind(SecurityController).to(SecurityController)
// container.bind(SecurityDeviceServices).to(SecurityDeviceServices)
// container.bind(UserSessionsRepository).to(UserSessionsRepository)
// container.bind(UserSessionsQueryRepository).to(UserSessionsQueryRepository)
// // MIDDLEWARE
// container.bind(SessionsMiddlewares).to(SessionsMiddlewares)
// // blogs
// container.bind(BlogsControllers).to(BlogsControllers)
// container.bind(BlogsServices).to(BlogsServices)
// container.bind(BlogsRepository).to(BlogsRepository)
// container.bind(BlogsQueryRepository).to(BlogsQueryRepository)
// container.bind(BlogValidationMiddlewares).to(BlogValidationMiddlewares)
// // Posts
// container.bind(PostsControllers).to(PostsControllers)
// container.bind(PostsServices).to(PostsServices)
// container.bind(PostsRepository).to(PostsRepository)
// container.bind(PostsQueryRepository).to(PostsQueryRepository)
// // MIDDLEWARE
// container.bind(PostsMiddlewares).to(PostsMiddlewares)
// // COMMENTS
// container.bind(CommentsControllers).to(CommentsControllers)
// container.bind(CommentsServices).to(CommentsServices)
// container.bind(CommentsRepository).to(CommentsRepository)
// container.bind(CommentsQueryRepository).to(CommentsQueryRepository)
// container.bind(СommentsMiddlewares).to(СommentsMiddlewares)
// container.bind(TestsController).to(TestsController)
