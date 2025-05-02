'use client'
import dynamic from "next/dynamic"

const UIBuilder = dynamic(() => import("@/layouts/Editor"), {
  ssr: false
})

const CanvasPage = () => {
  return (
    <UIBuilder/>
  )
}

export default CanvasPage
