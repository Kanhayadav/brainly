require('dotenv').config();
import express from 'express'
import { dbkey, jwt_key } from './config'
import { DBconnection } from './db'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import cors from 'cors'
import { UserModel, TaskModel, ContentModel, LinkModel } from './db'
import { authMiddleware } from './middleware'
import { z } from 'zod'
import bcrypt from 'bcrypt'
const app = express()
import cookieParer from 'cookie-parser'
import { randomBytes } from 'node:crypto';
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParer())
app.use(express())

app.post('/api/v1/signup', async (req, res) => {
    //added zod validation ;) 
    const reqbody = z.object({
        email: z.string().min(3, "must be more than 3 characters").max(40, "email too long").email(),
        password: z.string().min(8, "cant be less than 8 charaters").max(40, "cant be more than 30 characters").refine((val: any) => /[A-Z]/.test(val), { message: "password must contain at least one uppercase letter" }).refine((val: any) => /[a-z]/.test(val), { message: "Password must contain atleast one lowercase letter" }).refine((val: any) => /[!@#$%^&*()_+]/.test(val), { message: "Password must contain one special character" }).refine((val: any) => /[0123456789]/.test(val), { message: "Password must contain one number" })
    })
    const parseddata = reqbody.safeParse(req.body)
    if (!parseddata.success) {
        return res.status(411).json({
            message: "incorerct format",
            err: parseddata.error
        })
    }
    const { email, password } = req.body
    const hashedpassword = await bcrypt.hash(password, 5) //hashing done here :) 
    try {
        const user = await UserModel.create({
            email,
            password: hashedpassword//bycripted password: )
        })
        if (user) {
            return res.status(200).json({
                message: "signed up"
            })
        }
        return res.status(403).json({
            message: "user already exits "
        })
    } catch (e) {
        return res.status(500).json({
            err: "server error"
        })
    }
})

app.post('/api/v1/login', async (req, res) => {
    const reqbody = z.object({
        email: z.string().min(3, "must be more than 3 characters").max(30, "email too long").email(),
        password: z.string().min(8, "cant be less than 5 charaters").max(30, "cant be more than 30 characters").refine((val: any) => /[A-Z]/.test(val), { message: "password must contain at least one uppercase letter" }).refine((val: any) => /[a-z]/.test(val), { message: "Password must contain atleast one lowercase letter" }).refine((val: any) => /[!@#$%^&*()_+]/.test(val), { message: "Password must contain one special character" }).refine((val: any) => /[0123456789]/.test(val), { message: "Password must contain one number" })
    })
    const parsedreqbody = reqbody.safeParse(req.body)
    if (!parsedreqbody.success) {
        return res.status(403).json({
            message: "wrong email or password",
            err: parsedreqbody.error
        })
    }
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({
            email
        })
        if (!user) {
            return res.status(403).json({
                message: "wronge email or password"
            })
        }
        const passmatched = await bcrypt.compare(password, user.password)
        if (passmatched) {
            //genrate the jwt ;) and send cookie ;) 
            const token = jwt.sign({
                id: user._id
            }, jwt_key, { expiresIn: '7d' })

            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,   //🔴 true in production (HTTPS)
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            return res.json({
                sucess: true
            })
        }
        else {
            return res.status(403).json({
                message: "incorrect email or pass"
            })
        }
    } catch (e) {
        return res.status(500).json({
            message: "internal server " + e
        })
    }
})

app.post('/api/v1/content', authMiddleware, async (req, res) => {
    const { link, type, title } = req.body
    try {
        await ContentModel.create({
            link,
            type,
            title,
            //@ts-ignore
            userId: req.userId,
            tags: []
        })
        return res.status(200).json({
            message: "content added to the db"
        })
    } catch (e) {
        return res.status(500).json({
            message: "error adding content to the db"
        })
    }
})

app.post('/api/v1/sharelink', authMiddleware, async (req, res) => {
    const userId = (req as any).userId
    try {
        const user = await LinkModel.findOne({
            userId
        })
        if (user) {
            return res.json({
                link: user.hash,
            })
        }
        const hash = randomBytes(10).toString("hex");
        await LinkModel.create({
            hash,
            userId
        })
        res.json({
            link: hash
        })
    } catch (e) {
        return res.status(500).json({
            message: "error creating the link"
        })
    }
})

app.get('/api/v1/sharelink/:sharelink', async (req, res) => {
    const hash = req.params.sharelink
    try {
        const findLink = await LinkModel.findOne({ hash })
        if (!findLink) {
            return res.status(411).json({ message: "Invaild Link shared" })
        }
        const data = await ContentModel.find({
            userId: findLink.userId
        }).populate('userId', "email") //brother you can remove the userId ig you gotta check
        res.json({
            data
        })
    } catch (e) {
        return res.status(500).json({
            message: "some error occuored while getting data"
        })
    }
})

app.get('/api/v1/content', authMiddleware, async (req, res) => {
    const userId = (req as any).userId
    const content = await ContentModel.find({
        userId
    }).populate('userId', 'email')
    res.json({
        content
    })
})


app.get('/api/v1/me', authMiddleware, async (req, res) => {
    res.json({
        userId: (req as any).userId
    });
})


app.delete('/api/v1/content', authMiddleware, async (req, res) => {
    const contentId = req.body.contentId
    if (!contentId) {
        return res.status(400).json({ message: "contentId required" });
    }
    await ContentModel.deleteOne({
        _id: contentId,
        userId: (req as any).userId
    })
    res.json({
        message: "Deleted content ;) "
    })
})


app.post('/api/v1/logout', async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,          // ⚠️false we gotta change when uploarding the site(HTTP)
            sameSite: "lax"
        })
        return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (e) {
        return res.status(500).json({ message: "something wrong happened ;(" })
    }
})

DBconnection()

app.listen(3000, () => {
    console.log("server runnign ;O ")
})