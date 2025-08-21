import { Request, Response, NextFunction } from "express";
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "./utils";
import { SuccessfulResAndHttpStatusCodeArr,  } from "./ErrorMessagesAndHttpStatusCode";

export const SuccessfulResponse = (res: Response, statusCode: number, message?: string, send?: any) => {
    const responseObject = SuccessfulResAndHttpStatusCodeArr[statusCode];
    
    if(responseObject){
      return res
        .status(responseObject.statusCode)
        .json(send ? send : [responseObject.messages]);
    }else{
      return res
        .status(HTTP_STATUSES.OK_200)
        .json(send);
    }
}
  
