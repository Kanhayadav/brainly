import axios from 'axios'
import { BackendKey } from '../config'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'


type ProjectedRouteProps = {
    children: ReactNode
}

export function ProtectedRoute({ children }: ProjectedRouteProps) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function check() {
            try {
                await axios.get(BackendKey + '/api/v1/me', { withCredentials: true })
                setLoading(false)
            } catch (e) {
                navigate('/login')
            }
        }
        check()
    }, [navigate])
    if (loading) {
        return <div>Loading...</div>
    }
    return <>{children}</>
}