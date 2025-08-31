"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const userArrayMiddlewares_1 = require("./UserMiddlewares/userArrayMiddlewares");
const iocRoot_1 = require("../../shared/container/iocRoot");
const usersControllers_1 = require("./usersControllers");
exports.usersRouter = express_1.default.Router();
const usersControllers = iocRoot_1.container.get(usersControllers_1.UsersControllers);
exports.usersRouter.get('/', userArrayMiddlewares_1.getAllUsersMiddlewares, usersControllers.getAllUsers.bind(usersControllers));
exports.usersRouter.get('/:id', userArrayMiddlewares_1.getUserByIdMiddlewares, usersControllers.getUser.bind(usersControllers));
exports.usersRouter.post('/', userArrayMiddlewares_1.postUserMiddlewares, usersControllers.createUser.bind(usersControllers));
exports.usersRouter.put('/:id', userArrayMiddlewares_1.updateUserMiddlewares, usersControllers.updateUser.bind(usersControllers));
exports.usersRouter.delete('/:id', userArrayMiddlewares_1.deleteUserMiddlewares, usersControllers.deleteUser.bind(usersControllers));
