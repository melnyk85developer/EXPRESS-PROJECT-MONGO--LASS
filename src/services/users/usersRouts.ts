import express, { Response } from 'express';
import { deleteUserMiddlewares, getAllUsersMiddlewares, getUserByIdMiddlewares, postUserMiddlewares, updateUserMiddlewares } from './UserMiddlewares/userArrayMiddlewares';
import { usersController } from './usersControllers';

export const usersRouter = express.Router()

usersRouter.get('/', getAllUsersMiddlewares, usersController.getAllUsers)
usersRouter.get('/:id', getUserByIdMiddlewares, usersController.getUser)
usersRouter.post('/', postUserMiddlewares, usersController.createUser)
usersRouter.put('/:id', updateUserMiddlewares, usersController.updateUser)
usersRouter.delete('/:id', deleteUserMiddlewares, usersController.deleteUser)