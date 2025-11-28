'use client'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import React, { useRef, useState } from 'react'
import { Trash, Upload } from 'lucide-react'

type Props = {
    element: EditorElement
}

const AudioComponent = ({ element }: Props) => {
    const { dispatch, state } = useEditor()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    
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

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setIsUploading(true)
            
            const objectUrl = URL.createObjectURL(file)
            
            dispatch({
                type: 'UPDATE_ELEMENT',
                payload: {
                    elementDetails: {
                        ...element,
                        content: {
                            ...element.content,
                            src: objectUrl,
                            file: file
                        }
                    }
                }
            })
            
            setIsUploading(false)
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    return (
        <div 
            style={element.styles}
            className="relative"
            onClick={handleOnClickBody}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleAudioUpload}
                accept="audio/*"
                className="hidden"
            />
            
            {element.content?.src ? (
                <div className="p-4 bg-gray-100 rounded-lg">
                    <audio 
                        controls 
                        className="w-full"
                        src={element.content.src}
                    >
                        Your browser does not support the audio element.
                    </audio>
                </div>
            ) : (
                <div 
                    className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={triggerFileInput}
                >
                    <Upload size={20} className="text-gray-400 mb-1" />
                    <span className="text-gray-500 text-sm">Upload Audio</span>
                </div>
            )}
            
            {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="text-white">Uploading...</div>
                </div>
            )}
            
            {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
                <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg">
                    <Trash size={16} onClick={handleDeleteElement} className="cursor-pointer" />
                </div>
            )}
        </div>
    )
}

export default AudioComponent