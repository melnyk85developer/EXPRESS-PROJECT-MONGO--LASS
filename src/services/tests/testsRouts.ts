import { container } from "../../shared/container/iocRoot";
import express, { Response } from 'express';
import { TestsController } from "./testsController";

export const testsRouter = express.Router();

const testsController: TestsController = container.get(TestsController)

testsRouter.delete('/all-data', testsController.deleteAllEntity.bind(testsController))
