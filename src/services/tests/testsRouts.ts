import "reflect-metadata"
// import { container } from "../../shared/container/iocRoot";
import express, { Response } from 'express';
// import { testsController } from "./testsController";
import { TestsController } from "./testsController";
import { testsController } from "../../shared/container/compositionRootCustom";
// import { testsController } from "../../shared/container/compositionRootCustom";

export const testsRouter = express.Router();
// const testsController: TestsController = container.resolve(TestsController)

// const testsController: TestsController = container.get(TestsController)

// const deleteAllEntity = testsController.deleteAllEntity.bind(testsController);

testsRouter.delete('/all-data', testsController.deleteAllEntity.bind(testsController))
