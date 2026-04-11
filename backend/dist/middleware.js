"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
function authMiddleware(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({
            message: "somthing when wronggg"
        });
    }
    try {
        const decodedJWT = jsonwebtoken_1.default.verify(token, config_1.jwt_key);
        if (!decodedJWT || !decodedJWT.id) {
            return res.status(403).json({
                message: "invaild token :("
            });
        }
        req.userId = decodedJWT.id;
        next();
    }
    catch (e) {
        return res.status(403).json({
            message: "some error occured in the catch middleware;( " + e
        });
    }
}
