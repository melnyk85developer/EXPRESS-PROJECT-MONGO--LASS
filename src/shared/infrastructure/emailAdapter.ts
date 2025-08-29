import { SentMessageInfo } from "nodemailer";
import { SETTINGS } from "../settings";
import { injectable } from "inversify";
import * as nodemailer from 'nodemailer';

@injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendMail(from: string, to: string, subject: string, text: string, html: any) {
        return await this.transporter.sendMail({ from, to, subject, text, html });
    }
}

// export const emailAdapter = {
//     async sendMail(from: string, to: string, subject: string, text: string, message: any): Promise<SentMessageInfo | boolean> {
//         const info = await SETTINGS.Nodemailer.transport.sendMail({
//             from: from,
//             to: to,
//             subject: subject,
//             text: text,
//             html: message,
//         });
//         return info
//     },
// };