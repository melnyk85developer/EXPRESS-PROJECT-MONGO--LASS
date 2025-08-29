"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsControllers = void 0;
require("reflect-metadata");
const utils_1 = require("../../shared/utils/utils");
const SuccessfulResponse_1 = require("../../shared/utils/SuccessfulResponse");
const ErResSwitch_1 = require("../../shared/utils/ErResSwitch");
const inversify_1 = require("inversify");
let BlogsControllers = (() => {
    let _classDecorators = [(0, inversify_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BlogsControllers = _classThis = class {
        constructor(
        // @inject(TYPES.PostsQueryRepository)
        postsQueryRepository, 
        // @inject(TYPES.BlogsQueryRepository)
        blogsQueryRepository, 
        // @inject(TYPES.PostsServices)
        postsServices, 
        // @inject(TYPES.BlogsServices)
        blogsServices) {
            this.postsQueryRepository = postsQueryRepository;
            this.blogsQueryRepository = blogsQueryRepository;
            this.postsServices = postsServices;
            this.blogsServices = blogsServices;
        }
        getBlogsController(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.HTTP_STATUSES.OK_200, undefined, yield this.blogsQueryRepository.getAllBlogsRepository(req));
            });
        }
        getBlogIdAllPostsController(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, yield this.postsQueryRepository.getAllPostsRepositories(req));
            });
        }
        getBlogByIdController(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, yield this.blogsQueryRepository.getBlogByIdRepository(req.params.id));
            });
        }
        createBlogController(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const createBlog = yield this.blogsServices.createBlogServices(req.body);
                if (createBlog && createBlog.acknowledged === true) {
                    return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_BLOG, undefined, yield this.blogsQueryRepository.getBlogByIdRepository(createBlog.insertedId));
                }
                else {
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, createBlog);
                }
            });
        }
        createPostOneBlogController(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const createPostOneBlog = yield this.postsServices.createPostOneBlogServices(req);
                if (createPostOneBlog && createPostOneBlog.acknowledged === true) {
                    return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST, undefined, yield this.postsQueryRepository.getPostByIdRepositories(createPostOneBlog.insertedId));
                }
                else {
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, createPostOneBlog);
                }
            });
        }
        updateBlogController(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const updateBlog = yield this.blogsServices.updateBlogServices(req.params.id, req.body);
                if (updateBlog && updateBlog.acknowledged === true) {
                    return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_UPDATED_BLOG, undefined, yield this.postsQueryRepository.getPostByIdRepositories(updateBlog.insertedId));
                }
                else {
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, updateBlog);
                }
            });
        }
        deleteBlogController(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const blog = yield this.blogsServices.deleteBlogServices(req.params.id);
                if (blog && blog.acknowledged === true) {
                    return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_BLOG);
                }
                else {
                    return (0, ErResSwitch_1.ResErrorsSwitch)(res, blog);
                }
            });
        }
    };
    __setFunctionName(_classThis, "BlogsControllers");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BlogsControllers = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BlogsControllers = _classThis;
})();
exports.BlogsControllers = BlogsControllers;
