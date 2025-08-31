"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const config_1 = require("./config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];
    const verifyToken = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_USER);
    if (verifyToken) {
        //@ts-ignore
        req.id = verifyToken.id;
        next();
    }
    else {
        res.status(403).json({
            message: "you are not logged in"
        });
    }
};
exports.userMiddleware = userMiddleware;
