'use client'
import Recursive from '@/components/Editor/Recursive'
import { useEditor } from '@/providers/editor-provider'
import clsx from 'clsx'
import { EyeOff } from 'lucide-react'
import React, { useEffect } from 'react'

type Props = { liveMode?: boolean }

const FunnelEditor = ({ liveMode }: Props) => {
    const { dispatch, state } = useEditor()

    useEffect(() => {
        if (liveMode) {
            dispatch({
                type: 'TOGGLE_LIVE_MODE',
                payload: { value: true },
            })
        }
    }, [liveMode])

    const handleClick = () => {
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: {},
        })
    }

    const handleUnpreview = () => {
        dispatch({ type: 'TOGGLE_PREVIEW_MODE' })
        dispatch({ type: 'TOGGLE_LIVE_MODE' })
    }
    return (
        <div>

        </div>
    )
}

export default FunnelEditor