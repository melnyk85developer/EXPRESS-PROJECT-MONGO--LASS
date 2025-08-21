import e, { NextFunction, Request, Response } from "express";
import { FieldValidationError, validationResult } from "express-validator";

export const inputValidationMiddleware = (req: any, res: Response, next: NextFunction)  => {
    const e = validationResult(req)
    if(!e.isEmpty()){
        const eArray = e.array({onlyFirstError: true}) as { path: string, msg: string}[]
        res
            .status(400)
            .json({ 
                errorsMessages: eArray.map(e => ({
                    message: e.msg, 
                    field: e.path
                }))
            })
    }else{
        next()
    }
}
