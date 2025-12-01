'use client'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import React, { useState } from 'react'
import { Trash, Edit } from 'lucide-react'

type Props = {
    element: EditorElement
}

const ButtonComponent = ({ element }: Props) => {
    const { dispatch, state } = useEditor()
    const [isEditing, setIsEditing] = useState(false)
    const [buttonText, setButtonText] = useState(element.content?.toString || 'Click Me')

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!state.editor.liveMode && !isEditing) {
            setIsEditing(true)
        }
    }

    const deleteElement = () => {
        dispatch({ type: 'DELETE_ELEMENT', payload: { elementDetails: element } })
    }

    const saveText = () => {
        dispatch({
            type: 'UPDATE_ELEMENT',
            payload: {
                elementDetails: {
                    ...element,
                    content: { ...element.content, innerText: buttonText }
                }
            }
        })
        setIsEditing(false)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') saveText()
        if (e.key === 'Escape') {
            setIsEditing(false)
            setButtonText(element.content?.toString || 'Click Me')
        }
    }
///on edit
    if (isEditing && !state.editor.liveMode) {
        return (
            <div className="p-2 bg-white border border-blue-300 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Edit size={16} className="text-blue-500" />
                    <span className="text-sm">Edit Button</span>
                </div>
                <input
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full p-2 border rounded mb-2"
                    autoFocus
                />
                <div className="flex gap-2 justify-end">
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs border rounded">
                        Cancel
                    </button>
                    <button onClick={saveText} className="px-3 py-1 text-xs bg-blue-500 text-white rounded">
                        Save
                    </button>
                </div>
            </div>
        )
    }

//shows
    return (
        <div className="relative group">
            <button
                style={element.styles}
                onClick={handleClick}
                disabled={state.editor.liveMode}
                className="hover:opacity-90 active:scale-95 transition-all"
            >
                {(!Array.isArray(element.content) && element.content?.innerText) || 'Click Me'}
            </button>

            {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
                <div className="absolute -top-8 -right-1 flex gap-2 bg-primary px-2 py-1 rounded-lg">
                    <Edit size={14} onClick={() => setIsEditing(true)} className="cursor-pointer hover:text-blue-500" />
                    <Trash size={14} onClick={deleteElement} className="cursor-pointer hover:text-red-500" />
                </div>
            )}
        </div>
    )
}

export default ButtonComponent