// import { Request, Response, NextFunction } from 'express';
// import moment from 'moment';
// import { requestsCollection } from '../db';
// import { ResErrorsSwitch } from '../utils/ErResSwitch';
// import { INTERNAL_STATUS_CODE } from '../utils/utils';
// import { SETTINGS } from '../settings';

// export const protectedRequestLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//     // if(process.env.NODE_ENV === 'test'){
//     //     next();
//     //     return 
//     // }

//     if(!req.user!.id){
//         console.log('protectedRequestLimitMiddleware: - ', req.user!.id)
//         next()
//         return 
//     }else{
//         const request = { 
//             IP: req.ip, 
//             URL: req.originalUrl, 
//             date:  new Date() 
//         }
    
//         const timeWindow = SETTINGS.PROTECTED_TIME_WINDOW || 10000; // Интервал времени в миллисекундах
//         const maxRequests = SETTINGS.PROTECTED_MAX_REQUESTS || 10; // Максимальное количество запросов
//         const timeAgo = moment(request.date).subtract(timeWindow, 'milliseconds').toDate();
    
//         try {
//             const requestFilter = {
//                 IP: request.IP,
//                 URL: request.URL,
//                 date: { $gte: timeAgo }
//             };
    
//             const count = await requestsCollection.countDocuments(requestFilter);
    
//             if (count >= Number(maxRequests)) {
//                 console.log(`Превышен лимит запросов в protectedRequestLimitMiddleware для userId: ${request.IP}, URL: ${request.URL}, запросов: ${count}`);
//                 return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_TOO_MANY_REQUESTS)
//             }
    
//             await requestsCollection.insertOne(request);
//             // console.log('Запрос сохранен в базу:', requestData);
//         }catch(error){
//             console.error('Ошибка в protectedRequestLimitMiddleware:', error);
//             return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST, 'Что-то пошло не так при сохранении сессии в базу данных!')
    
//         }
//     }
// };
