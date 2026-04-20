import mongoose, { model, Schema, Types } from "mongoose";
import { dbkey } from './config'

export const DBconnection = async () => {
    try {
        await mongoose.connect(dbkey);
        console.log("DB connected ;)")
    } catch (e) {
        console.error("DB Connection Failed :(", e);
        process.exit(1);
    }
}

const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
})

const taskSchema = new Schema({
    title: { type: String, required: true, unique: true }
})
const contentTypes = ['image', 'video', 'article', 'youtube', 'twitter', 'x', 'X', 'Youtube', 'link'] as const

const contentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: Types.ObjectId, ref: 'tag' }],
    userId: { type: Types.ObjectId, ref: 'user', required: true },
    embedding: {
        type: [Number],
        required: true
    }
})

const linkSchema = new mongoose.Schema({
    hash: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: 'user', required: true },
    expiresAt: { type: Date, required: false },
})



export const UserModel = model('user', userSchema)
export const TaskModel = model('task', taskSchema)
export const ContentModel = model('content', contentSchema)
export const LinkModel = model('link', linkSchema)

