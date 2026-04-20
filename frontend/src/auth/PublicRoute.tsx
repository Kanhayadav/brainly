import axios from "axios"
import { useEffect, useState, type JSX } from "react"
import { BackendKey } from "../config"
import { Navigate } from "react-router-dom"

export function PublicRoute({ children }: { children: JSX.Element }) {
    const [auth, setAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const hittingendpoint = async () => {
            try {
                const res = axios.get(BackendKey + "/api/v1/me", { withCredentials: true })
                if ((await res).status === 200) {
                    setAuth(true)
                }
            } catch (e) {
                setAuth(false)
            } finally {
                setLoading(false)
            }

        }
        hittingendpoint()
    }, [])

    if (loading) {
        return <div>
            loading...
        </div>
    }

    if (auth) {
        return <Navigate to='/dashboard' />
    }
    return (
        children
    )
}


