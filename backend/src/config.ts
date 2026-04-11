import dotenv from 'dotenv';
dotenv.config()

export const dbkey = process.env.DATABASE_URL as string
export const jwt_key = process.env.JWT_SECERT as string