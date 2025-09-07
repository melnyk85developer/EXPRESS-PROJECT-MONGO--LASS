// import ErRes from "../utils/ErRes";
import { ErRes } from "../utils/ErRes";

export const errorHandler = (err: any, req: any, res: any, next: any) => {
    // Если мы уже отправили ответ внутри ErRes — ничего не делаем
    if (err instanceof ErRes) {
        if (err.sent) {
            // лог — для отладки
            // console.log('Error already sent by ErRes, skipping handler.');
            return;
        }
        return res.status(err.statusCode || 500).json(err.payload || { message: 'Internal error' });
    }

    // Если заголовки уже отправлены — передаём дальше
    if (res.headersSent) return next(err);

    // generic handling
    console.error('Unexpected error ->', err);
    return res.status(500).json({ message: 'Internal Server Error', field: null });
};
