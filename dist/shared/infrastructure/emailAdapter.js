"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailAdapter = void 0;
const settings_1 = require("../../settings");
exports.emailAdapter = {
    sendMail(from, to, subject, text, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield settings_1.SETTINGS.Nodemailer.transport.sendMail({
                from: from,
                to: to,
                subject: subject,
                text: text,
                html: message,
            });
            return info;
        });
    },
};
