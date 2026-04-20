import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import axios from "axios"
import { BackendKey } from "../config"

export function Login() {
    let navigate = useNavigate()
    const [errorr, setErrorr] = useState(false)
    useEffect(() => {
        if (errorr) {
            const timer = setTimeout(() => {
                setErrorr(false); // This hides the div
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [errorr]);

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    async function login() {
        const email = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        try {
            const log = await axios.post(BackendKey + "/api/v1/login", {
                email,
                password
            }, { withCredentials: true })
            if (log) {
                navigate('/dashboard')
            }
        } catch (e) {
            setErrorr(true)
        }
    }

    return (
        <>
            {errorr && (
                <div className="h-screen w-screen hover:bg-[#dc331d] transition-colors"></div>
            )}
            <div className="h-screen w-screen bg-[#7a4398] flex justify-center items-center">
                <div className="bg-white min-w-80 min-h-70 p-30 shadow-[-15px_15px_0px_0px_rgba(0,0,0,1)]">
                    <span className="mb-10 flex justify-center items-center text-[#7a4398] px-4 py-2 
                 font-black uppercase tracking-tighter text-3xl">
                        Login
                    </span>
                    <Input ref={usernameRef} type="text" placeholder="Email"></Input>
                    <Input ref={passwordRef} type="password" placeholder="Password"></Input>
                    <div className="flex justify-center pt-10">
                        <Button text="Login" onClick={login} variant="primary" size="sm" loading={false}></Button>
                    </div>

                    <span className="mt-14 flex justify-center items-center gap-2 font-medium">
                        New here ? <p onClick={() => navigate('/signup')} className="font-bold cursor-pointer"> Signup</p> </span>
                </div>
            </div>
        </>
    )
}