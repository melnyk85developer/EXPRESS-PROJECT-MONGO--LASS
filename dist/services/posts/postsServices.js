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
exports.PostsServices = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
let PostsServices = (() => {
    let _classDecorators = [(0, inversify_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PostsServices = _classThis = class {
        constructor(
        // @inject(TYPES.BlogsQueryRepository)
        blogsQueryRepository, 
        // @inject(TYPES.CommentsRepository)
        commentsRepository, 
        // @inject(TYPES.CommentsQueryRepository)
        commentsQueryRepository, 
        // @inject(TYPES.PostsRepository)
        postsRepository) {
            this.blogsQueryRepository = blogsQueryRepository;
            this.commentsRepository = commentsRepository;
            this.commentsQueryRepository = commentsQueryRepository;
            this.postsRepository = postsRepository;
        }
        createPostServices(post) {
            return __awaiter(this, void 0, void 0, function* () {
                const { title, shortDescription, content, blogId } = post;
                const date = new Date();
                // date.setMilliseconds(0);
                const createdAt = date.toISOString();
                const isIdBlog = yield this.blogsQueryRepository.getBlogByIdRepository(blogId);
                const createPost = {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId,
                    blogName: isIdBlog.name,
                    createdAt: createdAt
                };
                return yield this.postsRepository.createPostRepository(createPost);
            });
        }
        createPostOneBlogServices(req) {
            return __awaiter(this, void 0, void 0, function* () {
                const { blogId } = req.params;
                const { title, shortDescription, content } = req.body;
                const date = new Date();
                // date.setMilliseconds(0);
                const createdAt = date.toISOString();
                const isIdBlog = yield this.blogsQueryRepository.getBlogByIdRepository(blogId);
                const createPost = {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId,
                    blogName: isIdBlog.name,
                    createdAt: createdAt
                };
                return yield this.postsRepository.createPostRepository(createPost);
            });
        }
        updatePostServices(id, body) {
            return __awaiter(this, void 0, void 0, function* () {
                const updatedPost = {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId
                };
                return yield this.postsRepository.updatePostRepository(id, updatedPost);
            });
        }
        deletePostServices(id) {
            return __awaiter(this, void 0, void 0, function* () {
                // console.log('deletePostServices: - req id', id)
                const isComments = yield this.commentsQueryRepository.getAllCommentssRepository(id, '');
                // console.log('deletePostServices deleteAllComments: - req id, isComments', id, isComments)
                // if(isComments && isComments.items.length > 0){
                // console.log('deleteAllComments: - res id, isComments', id, isComments)
                const commsntExists = yield this.commentsRepository.deleteAllCommentsFromPostRepository(id);
                // console.log('deleteAllComments: - res ', id, commsntExists)
                // }
                return yield this.postsRepository.deletePostRepository(id);
            });
        }
    };
    __setFunctionName(_classThis, "PostsServices");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PostsServices = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PostsServices = _classThis;
})();
exports.PostsServices = PostsServices;
