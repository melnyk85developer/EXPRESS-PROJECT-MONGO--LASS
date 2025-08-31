"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testsRouter = void 0;
const iocRoot_1 = require("../../shared/container/iocRoot");
const express_1 = __importDefault(require("express"));
const testsController_1 = require("./testsController");
exports.testsRouter = express_1.default.Router();
const testsController = iocRoot_1.container.get(testsController_1.TestsController);
exports.testsRouter.delete('/all-data', testsController.deleteAllEntity.bind(testsController));
