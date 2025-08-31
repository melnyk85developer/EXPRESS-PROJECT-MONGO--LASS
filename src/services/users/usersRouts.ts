import express, { Response } from 'express';
import { deleteUserMiddlewares, getAllUsersMiddlewares, getUserByIdMiddlewares, postUserMiddlewares, updateUserMiddlewares } from './UserMiddlewares/userArrayMiddlewares';
import { container } from '../../shared/container/iocRoot';
import { UsersControllers } from './usersControllers';

export const usersRouter = express.Router()
const usersControllers: UsersControllers = container.get(UsersControllers)

usersRouter.get('/', getAllUsersMiddlewares, usersControllers.getAllUsers.bind(usersControllers))
usersRouter.get('/:id', getUserByIdMiddlewares, usersControllers.getUser.bind(usersControllers))
usersRouter.post('/', postUserMiddlewares, usersControllers.createUser.bind(usersControllers))
usersRouter.put('/:id', updateUserMiddlewares, usersControllers.updateUser.bind(usersControllers))
usersRouter.delete('/:id', deleteUserMiddlewares, usersControllers.deleteUser.bind(usersControllers))