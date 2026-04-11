"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.ContentModel = exports.TaskModel = exports.UserModel = exports.DBconnection = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const config_1 = require("./config");
const DBconnection = async () => {
    try {
        await mongoose_1.default.connect(config_1.dbkey);
        console.log("DB connected ;)");
    }
    catch (e) {
        console.error("DB Connection Failed :(", e);
        process.exit(1);
    }
};
exports.DBconnection = DBconnection;
const userSchema = new mongoose_1.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const taskSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true }
});
const contentTypes = ['image', 'video', 'article', 'youtube', 'twitter', 'x', 'X', 'Youtube', 'link'];
const contentSchema = new mongoose_1.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose_1.Types.ObjectId, ref: 'tag' }],
    userId: { type: mongoose_1.Types.ObjectId, ref: 'user', required: true },
});
const linkSchema = new mongoose_1.default.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose_1.Types.ObjectId, ref: 'user', required: true },
    expiresAt: { type: Date, required: false },
});
exports.UserModel = (0, mongoose_1.model)('user', userSchema);
exports.TaskModel = (0, mongoose_1.model)('task', taskSchema);
exports.ContentModel = (0, mongoose_1.model)('content', contentSchema);
exports.LinkModel = (0, mongoose_1.model)('link', linkSchema);
