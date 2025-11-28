'use client'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import React from 'react'
import { Trash } from 'lucide-react'

type Props = { element: EditorElement }

const ContactForm = ({ element }: Props) => {
    const { dispatch, state } = useEditor()

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: { elementDetails: element },
        })
    }

    const handleDeleteElement = () => {
        dispatch({
            type: 'DELETE_ELEMENT',
            payload: { elementDetails: element },
        })
    }

    return (
        <div className="relative" onClick={handleOnClickBody}>
            <div style={element.styles} className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-center"> contact us</h3>
                <div className="space-y-3">
                    <input 
                        type="text" 
                        placeholder="full name" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    <input 
                        type="email" 
                        placeholder="email" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    <textarea 
                        placeholder="message" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                    ></textarea>
                    <button className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors">
                        send
                    </button>
                </div>
            </div>

            {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
                <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg">
                    <Trash size={16} onClick={handleDeleteElement} className="cursor-pointer" />
                </div>
            )}
        </div>
    )
}

export default ContactForm