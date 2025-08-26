import express, { Response } from 'express';
import "reflect-metadata"
import { deleteUserMiddlewares, getAllUsersMiddlewares, getUserByIdMiddlewares, postUserMiddlewares, updateUserMiddlewares } from './UserMiddlewares/userArrayMiddlewares';
// import { usersControllers } from '../../shared/container/compositionRootCustom';
// import { container } from '../../shared/container/iocRoot';
import { UsersControllers } from './usersControllers';
import { usersControllers } from '../../shared/container/compositionRootCustom';

export const usersRouter = express.Router()

// const usersControllers: UsersControllers = container.resolve(UsersControllers)

usersRouter.get('/', getAllUsersMiddlewares, usersControllers.getAllUsers.bind(usersControllers))
usersRouter.get('/:id', getUserByIdMiddlewares, usersControllers.getUser.bind(usersControllers))
usersRouter.post('/', postUserMiddlewares, usersControllers.createUser.bind(usersControllers))
usersRouter.put('/:id', updateUserMiddlewares, usersControllers.updateUser.bind(usersControllers))
usersRouter.delete('/:id', deleteUserMiddlewares, usersControllers.deleteUser.bind(usersControllers))