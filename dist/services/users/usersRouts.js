"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const userArrayMiddlewares_1 = require("./UserMiddlewares/userArrayMiddlewares");
const compositionRootCustom_1 = require("../../shared/container/compositionRootCustom");
exports.usersRouter = express_1.default.Router();
// const usersControllers: UsersControllers = container.resolve(UsersControllers)
exports.usersRouter.get('/', userArrayMiddlewares_1.getAllUsersMiddlewares, compositionRootCustom_1.usersControllers.getAllUsers.bind(compositionRootCustom_1.usersControllers));
exports.usersRouter.get('/:id', userArrayMiddlewares_1.getUserByIdMiddlewares, compositionRootCustom_1.usersControllers.getUser.bind(compositionRootCustom_1.usersControllers));
exports.usersRouter.post('/', userArrayMiddlewares_1.postUserMiddlewares, compositionRootCustom_1.usersControllers.createUser.bind(compositionRootCustom_1.usersControllers));
exports.usersRouter.put('/:id', userArrayMiddlewares_1.updateUserMiddlewares, compositionRootCustom_1.usersControllers.updateUser.bind(compositionRootCustom_1.usersControllers));
exports.usersRouter.delete('/:id', userArrayMiddlewares_1.deleteUserMiddlewares, compositionRootCustom_1.usersControllers.deleteUser.bind(compositionRootCustom_1.usersControllers));
