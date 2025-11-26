'use client'
import { EditorBtns, defaultStyles } from "@/constants/editor"
import clsx from 'clsx'
import React, { useEffect } from 'react'
import { v4 } from 'uuid'
import Recursive from '../components/Editor/Recursive'
import { EyeOff, Trash } from 'lucide-react'
import { EditorElement, useEditor } from "@/providers/editor-provider"

type Props = { liveMode?: boolean }

const Editor = ({ liveMode = false }: Props) => {
    const { dispatch, state } = useEditor()
    console.log("State: ", state)
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
        <div
            className="bg-white w-[1024px] min-h-80"
        >
            <div
                className={clsx(
                    'use-automation-zoom-in h-full  bg-background transition-all rounded-md',
                    {
                        '!p-0 !mr-0':
                            state.editor.previewMode === true || state.editor.liveMode === true,
                        '!w-[850px]': state.editor.device === 'Tablet',
                        '!w-[420px]': state.editor.device === 'Mobile',
                        'w-full': state.editor.device === 'Desktop',
                    }
                )}
                onClick={handleClick}
            >
                {/* {state.editor.previewMode && state.editor.liveMode && (
                    <button
                        className="w-6 h-6 bg-slate-600 p-[2px] fixed top-0 left-0 z-[100]"
                        onClick={handleUnpreview}
                    >
                        <EyeOff />
                    </button>
                )} */}
                {Array.isArray(state.editor.elements) &&
                    state.editor.elements.map((childElement) => (
                        <Recursive
                            key={childElement.id}
                            element={childElement}
                        />
                    ))}
            </div>
        </div>
    )

}

export default Editor