import { NextFunction, Request, Response } from "express";
import { JWT_SECRET_USER } from "./config"
import jwt from "jsonwebtoken"

export const userMiddleware = (req: Request, res: Response, next: NextFunction)=>{
const token = req.headers["authorization"]

const verifyToken = jwt.verify(token as string, JWT_SECRET_USER)
if(verifyToken){
    //@ts-ignore
    req.id = verifyToken.id
    next()
}else{
    res.status(403).json({
        message:"you are not logged in"
    })
}
}