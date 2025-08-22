import { SentMessageInfo } from "nodemailer";
import { SETTINGS } from "../../settings";

export const emailAdapter = {
    async sendMail(from: string, to: string, subject: string, text: string, message: any): Promise<SentMessageInfo | boolean> {
        const info = await SETTINGS.Nodemailer.transport.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: message,
        });
        return info
    },
};