import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { jwt_key } from './config'


interface AuthReq extends Request {
    userId?: string;
}
export function authMiddleware(req: AuthReq, res: Response, next: NextFunction) {
    const token = req.cookies?.token
    if (!token) {
        return res.status(401).json({
            message: "somthing when wronggg"
        })
    }
    try {
        const decodedJWT = jwt.verify(token as string, jwt_key) as JwtPayload

        if (!decodedJWT || !decodedJWT.id) {
            return res.status(403).json({
                message: "invaild token :("
            })
        }
        req.userId = decodedJWT.id
        next();
    } catch (e) {
        return res.status(403).json({
            message: "some error occured in the catch middleware;( " + e
        })
    }
}