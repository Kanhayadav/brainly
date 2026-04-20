import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { useNavigate } from "react-router-dom"
import { BackendKey } from '../config'
import { useRef, useState } from 'react'
import axios from "axios";

export function Signup() {
    let navigate = useNavigate()
    const [error, setError] = useState('')
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    async function signup() {
        const email = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        try {
            await axios.post(BackendKey + "/api/v1/signup", {
                email, password
            })
            setError("")
            navigate('/login');
        } catch (e: any) {
            setError("something went wrong:(")
        }
    }
    return (
        <>
            <div className="h-screen w-screen bg-[#7a4398] flex justify-center items-center">
                <div className="bg-white min-w-80 min-h-70 p-30 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
                    <span className="mb-10 flex justify-center items-center text-[#7a4398] px-4 py-2 
                 font-black uppercase tracking-tighter text-3xl">
                        Signup
                    </span>
                    <Input ref={usernameRef} type="text" placeholder="Email"></Input>
                    <Input ref={passwordRef} type="password" placeholder="Password"></Input>
                    {error && (
                        <div className="mt-5 text-center text-white bg-red-500 font-bold p-3">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-center pt-10">
                        <Button text="Signup" onClick={signup} variant="primary" size="sm" loading={false}></Button>
                    </div>
                    <span className="mt-14 flex justify-center items-center gap-2 font-medium">Already Logged in? <p onClick={() => navigate('/login')} className="font-bold cursor-pointer"> Login</p> </span>
                </div>
            </div>
        </>
    )
}