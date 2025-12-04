
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/auth-store'

const Authguard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = useAuthStore(state => state.user)
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.replace('/auth/login') // or your login route
        }
    }, [user, router])

    if (!user) return <>Loading.....</>
    return <>{children}</>
}

export default Authguard