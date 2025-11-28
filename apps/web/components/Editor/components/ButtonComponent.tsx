'use client'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import React from 'react'
import { Trash, MousePointerClick} from 'lucide-react'

type Props = {
    element: EditorElement
}

const ButtonComponent = ({ element }: Props) => {
    const { dispatch, state } = useEditor()
    
    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: {
                elementDetails: element,
            },
        })
    }

    const handleDeleteElement = () => {
        dispatch({
            type: 'DELETE_ELEMENT',
            payload: { elementDetails: element },
        })
    }

    return (
        <div className="relative group/button">
            <button
                style={element.styles}
                className={`
                    transition-all duration-200 
                    hover:opacity-90 active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${!state.editor.liveMode ? 'cursor-pointer' : ''}
                `}
                onClick={handleOnClickBody}
                disabled={state.editor.liveMode}
            >
                [element.content?.innerText || 'Click Me']
            </button>

            {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
                <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg">
                    <Trash 
                        size={16} 
                        onClick={handleDeleteElement} 
                        className="cursor-pointer hover:text-red-500 transition-colors" 
                    />
                </div>
            )}
        </div>
    )
}

export default ButtonComponent