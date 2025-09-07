"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSIONS_INTERNAL_STATUS = void 0;
exports.SESSIONS_INTERNAL_STATUS = {
    SUCCESS_CREATED_SESSIONS: 994, // Успешное создание сессии!
    SUCCESS_DELETED_SESSIONS: 995, // Успешное удаление сессии!
    SUCCESS_DELETED_OTHER_SESSIONS: 996, // Успешное удаление других сессий!
    SUCCESS_DELETED_SESSIONS_BY_DEVICE_ID: 997, // Успешное удаление сессии по deviceId!
    SUCCESS_DELETED_ALL_SESSIONS: 998, // Успешное удаление всех сессий!
    UNAUTHORIZED_SESSION_CREATION_ERROR: 913, // Ошибка создания сессии! 
    UNAUTHORIZED_SESSION_UPDATION_ERROR: 927, // Ошибка обновления сессии!
    UNAUTHORIZED_SESSION_DELETION_ERROR: 928, // Ошибка удаления сессии!
    FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_SESSION: 1009, // Не корректный запрос, вы не являетесь влядельцем сессии
    SESSION_ID_NOT_FOUND: 925, // Сессия не найдена!
};
