"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testsRouter = void 0;
require("reflect-metadata");
// import { container } from "../../shared/container/iocRoot";
const express_1 = __importDefault(require("express"));
const compositionRootCustom_1 = require("../../shared/container/compositionRootCustom");
// import { testsController } from "../../shared/container/compositionRootCustom";
exports.testsRouter = express_1.default.Router();
// const testsController: TestsController = container.resolve(TestsController)
// const testsController: TestsController = container.get(TestsController)
// const deleteAllEntity = testsController.deleteAllEntity.bind(testsController);
exports.testsRouter.delete('/all-data', compositionRootCustom_1.testsController.deleteAllEntity.bind(compositionRootCustom_1.testsController));
