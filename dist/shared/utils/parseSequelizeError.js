"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDBResponseError = void 0;
const parseDBResponseError = (error) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (!error || typeof error !== 'object') {
        return { status: 9999, message: 'Неизвестная ошибка: объект ошибки не передан или невалиден' };
    }
    // ---------------- Sequelize ----------------
    if (error.name === 'SequelizeUniqueConstraintError') {
        const field = ((_b = (_a = error === null || error === void 0 ? void 0 : error.errors) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) || 'unknown';
        return { status: 1001, message: `Поле '${field}' должно быть уникальным` };
    }
    if (error.name === 'SequelizeValidationError') {
        const field = ((_d = (_c = error === null || error === void 0 ? void 0 : error.errors) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path) || 'unknown';
        const message = ((_f = (_e = error === null || error === void 0 ? void 0 : error.errors) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.message) || 'Ошибка валидации';
        return { status: 1002, message: `Ошибка валидации поля '${field}': ${message}` };
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return { status: 1003, message: `Ошибка внешнего ключа: связанная сущность не найдена` };
    }
    if (error.name === 'SequelizeConnectionRefusedError') {
        return { status: 1004, message: 'Подключение к БД отклонено (Sequelize)' };
    }
    if (error.name === 'SequelizeConnectionTimedOutError') {
        return { status: 1005, message: 'Таймаут соединения с БД (Sequelize)' };
    }
    if (error.name === 'SequelizeHostNotFoundError') {
        return { status: 1006, message: 'Хост БД не найден (Sequelize)' };
    }
    if (error.name === 'SequelizeHostNotReachableError') {
        return { status: 1007, message: 'Хост БД недоступен (Sequelize)' };
    }
    if (error.name === 'SequelizeInvalidConnectionError') {
        return { status: 1008, message: 'Недействительное соединение (Sequelize)' };
    }
    if (error.name === 'SequelizeEmptyResultError') {
        return { status: 1009, message: 'Результат запроса пустой (Sequelize)' };
    }
    if (error.name === 'SequelizeDatabaseError') {
        const code = (_g = error.original) === null || _g === void 0 ? void 0 : _g.code;
        // ---------- PostgreSQL ----------
        if (code === '23505')
            return { status: 2001, message: `Нарушение уникальности (Postgres)` };
        if (code === '23502')
            return { status: 2002, message: `NULL в поле, которое не может быть NULL (Postgres)` };
        if (code === '22P02')
            return { status: 2003, message: `Неверный формат данных (Postgres)` };
        if (code === '42804')
            return { status: 2004, message: `Несовместимый тип данных (Postgres)` };
        if (code === '42703')
            return { status: 2005, message: `Обращение к несуществующему столбцу (Postgres)` };
        if (code === '42P01')
            return { status: 2006, message: `Таблица не найдена (Postgres)` };
        if (code === '42601')
            return { status: 2007, message: `Синтаксическая ошибка SQL (Postgres)` };
        // ---------- MySQL / MariaDB ----------
        if (code === 'ER_DUP_ENTRY')
            return { status: 3001, message: `Дубликат значения (MySQL)` };
        if (code === 'ER_NO_REFERENCED_ROW_2')
            return { status: 3002, message: `Связанная запись не найдена (MySQL)` };
        if (code === 'ER_BAD_NULL_ERROR')
            return { status: 3003, message: `NULL в поле с ограничением NOT NULL (MySQL)` };
        // ---------- SQLite ----------
        if (code === 'SQLITE_CONSTRAINT')
            return { status: 4001, message: `Нарушение ограничения (SQLite)` };
        if (code === 'SQLITE_MISMATCH')
            return { status: 4002, message: `Несовпадение типов данных (SQLite)` };
        // ---------- MSSQL ----------
        if (code === 547)
            return { status: 5001, message: `Нарушение внешнего ключа (MSSQL)` };
        if (code === 2627)
            return { status: 5002, message: `Нарушение уникальности (MSSQL)` };
        if (code === 515)
            return { status: 5003, message: `NULL в поле с ограничением (MSSQL)` };
        // ---------- Oracle ----------
        if (code === 'ORA-00001')
            return { status: 6001, message: `Нарушение уникальности (Oracle)` };
        if (code === 'ORA-02291')
            return { status: 6002, message: `Ошибка внешнего ключа (Oracle)` };
        if (code === 'ORA-01400')
            return { status: 6003, message: `NULL в поле с ограничением NOT NULL (Oracle)` };
        if (code === 'ORA-00942')
            return { status: 6004, message: `Таблица или представление не существует (Oracle)` };
        return { status: 1999, message: `Неизвестная ошибка SequelizeDatabaseError: ${code}` };
    }
    // ---------------- MongoDB / MongoMemoryServer ----------------
    if (error.name === 'MongoServerError' || error.name === 'MongoError') {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue || {})[0] || 'unknown';
            return { status: 7001, message: `Значение '${field}' уже существует (MongoDB)` };
        }
        return { status: 7002, message: `Ошибка MongoDB: ${error.message}` };
    }
    // ---------------- Redis ----------------
    if ((_h = error.message) === null || _h === void 0 ? void 0 : _h.includes('READONLY')) {
        return { status: 8001, message: 'Redis в режиме только для чтения' };
    }
    if ((_j = error.message) === null || _j === void 0 ? void 0 : _j.includes('ECONNREFUSED')) {
        return { status: 8002, message: 'Подключение к Redis отклонено' };
    }
    // ---------------- Обработка ошибок подключения ----------------
    if (error.code === 'ECONNREFUSED') {
        return { status: 9001, message: 'Подключение к БД отклонено (низкоуровневая ошибка)' };
    }
    if (error.code === 'ETIMEDOUT') {
        return { status: 9002, message: 'Истекло время ожидания соединения с БД' };
    }
    // // ---------------- По умолчанию — не возвращаем 500! ----------------
    // throw new Error(`Необработанная ошибка БД: ${JSON.stringify(error, null, 2)}`);
    // console.error('parseDBResponseError: - error: ', error)
    return error;
};
exports.parseDBResponseError = parseDBResponseError;
