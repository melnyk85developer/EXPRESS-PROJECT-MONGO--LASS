"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const userArrayMiddlewares_1 = require("./UserMiddlewares/userArrayMiddlewares");
const usersControllers_1 = require("./usersControllers");
exports.usersRouter = express_1.default.Router();
exports.usersRouter.get('/', userArrayMiddlewares_1.getAllUsersMiddlewares, usersControllers_1.usersController.getAllUsers);
exports.usersRouter.get('/:id', userArrayMiddlewares_1.getUserByIdMiddlewares, usersControllers_1.usersController.getUser);
exports.usersRouter.post('/', userArrayMiddlewares_1.postUserMiddlewares, usersControllers_1.usersController.createUser);
exports.usersRouter.put('/:id', userArrayMiddlewares_1.updateUserMiddlewares, usersControllers_1.usersController.updateUser);
exports.usersRouter.delete('/:id', userArrayMiddlewares_1.deleteUserMiddlewares, usersControllers_1.usersController.deleteUser);
