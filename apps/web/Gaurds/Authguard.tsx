
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/auth-store'

const Authguard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const token = useAuthStore(state => state.accessToken)
    const router = useRouter()

    useEffect(() => {
        if (!token) {
            router.replace('/auth/login') // or your login route
        }
    }, [token, router])

    if (!token) return <>Loading.....</>
    return <>{children}</>
}

export default Authguard