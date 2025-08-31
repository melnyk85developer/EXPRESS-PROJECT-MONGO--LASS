"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const usersRepository_1 = require("../../services/users/UserRpository/usersRepository");
const authServices_1 = require("../../services/auth/authServices");
const authControllers_1 = require("../../services/auth/authControllers");
const tokenService_1 = require("../infrastructure/tokenService");
const usersServices_1 = require("../../services/users/usersServices");
const usersQueryRepository_1 = require("../../services/users/UserRpository/usersQueryRepository");
const usersControllers_1 = require("../../services/users/usersControllers");
const createSuperAdminAdapter_1 = require("../infrastructure/createSuperAdminAdapter");
const userSessionsRepository_1 = require("../../services/usersSessions/UserSessionsRpository/userSessionsRepository");
const userSessionQueryRepository_1 = require("../../services/usersSessions/UserSessionsRpository/userSessionQueryRepository");
const blogsServices_1 = require("../../services/blogs/blogsServices");
const blogsRepository_1 = require("../../services/blogs/BlogsRepository/blogsRepository");
const blogQueryRepository_1 = require("../../services/blogs/BlogsRepository/blogQueryRepository");
const blogsController_1 = require("../../services/blogs/blogsController");
const postControllers_1 = require("../../services/posts/postControllers");
const postsServices_1 = require("../../services/posts/postsServices");
const postsRepository_1 = require("../../services/posts/PostRepository/postsRepository");
const postQueryRepository_1 = require("../../services/posts/PostRepository/postQueryRepository");
const commentsRepository_1 = require("../../services/comments/CommentRepository/commentsRepository");
const commentsQueryRepository_1 = require("../../services/comments/CommentRepository/commentsQueryRepository");
const commentsServices_1 = require("../../services/comments/commentsServices");
const commentsControllers_1 = require("../../services/comments/commentsControllers");
const securityController_1 = require("../../services/usersSessions/securityController");
const securityDeviceService_1 = require("../../services/usersSessions/securityDeviceService");
const db_1 = require("../../db");
const globalRequestLimitMiddleware_1 = require("../middlewares/globalRequestLimitMiddleware");
const isThereASessionValidation_1 = require("../../services/usersSessions/userSessionsMiddlewares/isThereASessionValidation");
const isThereAUserValidation_1 = require("../../services/users/UserMiddlewares/isThereAUserValidation");
const isThereABlogValidation_1 = require("../../services/blogs/BlogsMiddlewares/isThereABlogValidation");
const isThereAPostValidation_1 = require("../../services/posts/PostMiddlewares/isThereAPostValidation");
const isThereACommentValidation_1 = require("../../services/comments/CommentMiddlewares/isThereACommentValidation");
const authGuardMiddleware_1 = require("../../services/auth/AuthMiddlewares/authGuardMiddleware");
const testsController_1 = require("../../services/tests/testsController");
const emailAdapter_1 = require("../infrastructure/emailAdapter");
exports.container = new inversify_1.Container();
// DB
exports.container.bind(db_1.MongoDBCollection).to(db_1.MongoDBCollection).inSingletonScope();
exports.container.bind(emailAdapter_1.MailService).to(emailAdapter_1.MailService).inSingletonScope();
// MIDDLEWARE
exports.container.bind(globalRequestLimitMiddleware_1.GlobalRequestLimitMiddleware).to(globalRequestLimitMiddleware_1.GlobalRequestLimitMiddleware);
// auth
exports.container.bind(authControllers_1.AuthControllers).to(authControllers_1.AuthControllers);
exports.container.bind(authServices_1.AuthServices).to(authServices_1.AuthServices);
exports.container.bind(tokenService_1.TokenService).to(tokenService_1.TokenService);
// MIDDLEWARE
exports.container.bind(authGuardMiddleware_1.AuthMiddlewares).to(authGuardMiddleware_1.AuthMiddlewares);
// users
exports.container.bind(usersControllers_1.UsersControllers).to(usersControllers_1.UsersControllers);
exports.container.bind(usersServices_1.UserService).to(usersServices_1.UserService);
exports.container.bind(usersRepository_1.UsersRepository).to(usersRepository_1.UsersRepository);
exports.container.bind(usersQueryRepository_1.UsersQueryRepository).to(usersQueryRepository_1.UsersQueryRepository);
exports.container.bind(createSuperAdminAdapter_1.SuperAdminAdapter).to(createSuperAdminAdapter_1.SuperAdminAdapter);
// MIDDLEWARE
exports.container.bind(isThereAUserValidation_1.UsersMiddlewares).to(isThereAUserValidation_1.UsersMiddlewares);
// SESSIONS
exports.container.bind(securityController_1.SecurityController).to(securityController_1.SecurityController);
exports.container.bind(securityDeviceService_1.SecurityDeviceServices).to(securityDeviceService_1.SecurityDeviceServices);
exports.container.bind(userSessionsRepository_1.UserSessionsRepository).to(userSessionsRepository_1.UserSessionsRepository);
exports.container.bind(userSessionQueryRepository_1.UserSessionsQueryRepository).to(userSessionQueryRepository_1.UserSessionsQueryRepository);
// MIDDLEWARE
exports.container.bind(isThereASessionValidation_1.SessionsMiddlewares).to(isThereASessionValidation_1.SessionsMiddlewares);
// blogs
exports.container.bind(blogsController_1.BlogsControllers).to(blogsController_1.BlogsControllers);
exports.container.bind(blogsServices_1.BlogsServices).to(blogsServices_1.BlogsServices);
exports.container.bind(blogsRepository_1.BlogsRepository).to(blogsRepository_1.BlogsRepository);
exports.container.bind(blogQueryRepository_1.BlogsQueryRepository).to(blogQueryRepository_1.BlogsQueryRepository);
exports.container.bind(isThereABlogValidation_1.BlogValidationMiddlewares).to(isThereABlogValidation_1.BlogValidationMiddlewares);
// Posts
exports.container.bind(postControllers_1.PostsControllers).to(postControllers_1.PostsControllers);
exports.container.bind(postsServices_1.PostsServices).to(postsServices_1.PostsServices);
exports.container.bind(postsRepository_1.PostsRepository).to(postsRepository_1.PostsRepository);
exports.container.bind(postQueryRepository_1.PostsQueryRepository).to(postQueryRepository_1.PostsQueryRepository);
// MIDDLEWARE
exports.container.bind(isThereAPostValidation_1.PostsMiddlewares).to(isThereAPostValidation_1.PostsMiddlewares);
// COMMENTS
exports.container.bind(commentsControllers_1.CommentsControllers).to(commentsControllers_1.CommentsControllers);
exports.container.bind(commentsServices_1.CommentsServices).to(commentsServices_1.CommentsServices);
exports.container.bind(commentsRepository_1.CommentsRepository).to(commentsRepository_1.CommentsRepository);
exports.container.bind(commentsQueryRepository_1.CommentsQueryRepository).to(commentsQueryRepository_1.CommentsQueryRepository);
exports.container.bind(isThereACommentValidation_1.СommentsMiddlewares).to(isThereACommentValidation_1.СommentsMiddlewares);
exports.container.bind(testsController_1.TestsController).to(testsController_1.TestsController);
