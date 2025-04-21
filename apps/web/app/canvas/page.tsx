'use client'
import dynamic from "next/dynamic"

const UIBuilder = dynamic(() => import("@/components/Canvas/canvas"), {
  ssr: false
})


const CanvasPage = () => {
  return (
    <UIBuilder/>
  )
}

export default CanvasPage
