import { PageStoreProvider } from '@/providers/createPageStore'
import React from 'react'

const CanvasLayout = ({children} : Readonly<{
    children: React.ReactNode
}>) => {
  return (
    <PageStoreProvider>{children}</PageStoreProvider>
  )
}

export default CanvasLayout