"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const db_2 = require("./db");
const middleware_1 = require("./middleware");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const node_crypto_1 = require("node:crypto");
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_1.default)());
app.post('/api/v1/signup', async (req, res) => {
    //added zod validation ;) 
    const reqbody = zod_1.z.object({
        email: zod_1.z.string().min(3, "must be more than 3 characters").max(40, "email too long").email(),
        password: zod_1.z.string().min(8, "cant be less than 8 charaters").max(40, "cant be more than 30 characters").refine((val) => /[A-Z]/.test(val), { message: "password must contain at least one uppercase letter" }).refine((val) => /[a-z]/.test(val), { message: "Password must contain atleast one lowercase letter" }).refine((val) => /[!@#$%^&*()_+]/.test(val), { message: "Password must contain one special character" }).refine((val) => /[0123456789]/.test(val), { message: "Password must contain one number" })
    });
    const parseddata = reqbody.safeParse(req.body);
    if (!parseddata.success) {
        return res.status(411).json({
            message: "incorerct format",
            err: parseddata.error
        });
    }
    const { email, password } = req.body;
    const hashedpassword = await bcrypt_1.default.hash(password, 5); //hashing done here :) 
    try {
        const user = await db_2.UserModel.create({
            email,
            password: hashedpassword //bycripted password: )
        });
        if (user) {
            return res.status(200).json({
                message: "signed up"
            });
        }
        return res.status(403).json({
            message: "user already exits "
        });
    }
    catch (e) {
        return res.status(500).json({
            err: "server error"
        });
    }
});
app.post('/api/v1/login', async (req, res) => {
    const reqbody = zod_1.z.object({
        email: zod_1.z.string().min(3, "must be more than 3 characters").max(30, "email too long").email(),
        password: zod_1.z.string().min(8, "cant be less than 5 charaters").max(30, "cant be more than 30 characters").refine((val) => /[A-Z]/.test(val), { message: "password must contain at least one uppercase letter" }).refine((val) => /[a-z]/.test(val), { message: "Password must contain atleast one lowercase letter" }).refine((val) => /[!@#$%^&*()_+]/.test(val), { message: "Password must contain one special character" }).refine((val) => /[0123456789]/.test(val), { message: "Password must contain one number" })
    });
    const parsedreqbody = reqbody.safeParse(req.body);
    if (!parsedreqbody.success) {
        return res.status(403).json({
            message: "wrong email or password",
            err: parsedreqbody.error
        });
    }
    const { email, password } = req.body;
    try {
        const user = await db_2.UserModel.findOne({
            email
        });
        if (!user) {
            return res.status(403).json({
                message: "wronge email or password"
            });
        }
        const passmatched = await bcrypt_1.default.compare(password, user.password);
        if (passmatched) {
            //genrate the jwt ;) and send cookie ;) 
            const token = jsonwebtoken_1.default.sign({
                id: user._id
            }, config_1.jwt_key, { expiresIn: '7d' });
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                secure: false, //🔴 true in production (HTTPS)
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            return res.json({
                sucess: true
            });
        }
        else {
            return res.status(403).json({
                message: "incorrect email or pass"
            });
        }
    }
    catch (e) {
        return res.status(500).json({
            message: "internal server " + e
        });
    }
});
app.post('/api/v1/content', middleware_1.authMiddleware, async (req, res) => {
    const { link, type, title } = req.body;
    try {
        await db_2.ContentModel.create({
            link,
            type,
            title,
            //@ts-ignore
            userId: req.userId,
            tags: []
        });
        return res.status(200).json({
            message: "content added to the db"
        });
    }
    catch (e) {
        return res.status(500).json({
            message: "error adding content to the db"
        });
    }
});
app.post('/api/v1/sharelink', middleware_1.authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await db_2.LinkModel.findOne({
            userId
        });
        if (user) {
            return res.json({
                link: user.hash,
            });
        }
        const hash = (0, node_crypto_1.randomBytes)(10).toString("hex");
        await db_2.LinkModel.create({
            hash,
            userId
        });
        res.json({
            link: hash
        });
    }
    catch (e) {
        return res.status(500).json({
            message: "error creating the link"
        });
    }
});
app.get('/api/v1/sharelink/:sharelink', async (req, res) => {
    const hash = req.params.sharelink;
    try {
        const findLink = await db_2.LinkModel.findOne({ hash });
        if (!findLink) {
            return res.status(411).json({ message: "Invaild Link shared" });
        }
        const data = await db_2.ContentModel.find({
            userId: findLink.userId
        }).populate('userId', "email"); //brother you can remove the userId ig you gotta check
        res.json({
            data
        });
    }
    catch (e) {
        return res.status(500).json({
            message: "some error occuored while getting data"
        });
    }
});
app.get('/api/v1/content', middleware_1.authMiddleware, async (req, res) => {
    const userId = req.userId;
    const content = await db_2.ContentModel.find({
        userId
    }).populate('userId', 'email');
    res.json({
        content
    });
});
app.get('/api/v1/me', middleware_1.authMiddleware, async (req, res) => {
    res.json({
        userId: req.userId
    });
});
app.delete('/api/v1/content', middleware_1.authMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    if (!contentId) {
        return res.status(400).json({ message: "contentId required" });
    }
    await db_2.ContentModel.deleteOne({
        _id: contentId,
        userId: req.userId
    });
    res.json({
        message: "Deleted content ;) "
    });
});
app.post('/api/v1/logout', async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false, // ⚠️false we gotta change when uploarding the site(HTTP)
            sameSite: "lax"
        });
        return res.status(200).json({
            message: "Logged out successfully"
        });
    }
    catch (e) {
        return res.status(500).json({ message: "something wrong happened ;(" });
    }
});
(0, db_1.DBconnection)();
app.listen(3000, () => {
    console.log("server runnign ;O ");
});
