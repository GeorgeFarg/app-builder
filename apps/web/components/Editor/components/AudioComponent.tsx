'use client'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import React, { useRef, useState } from 'react'
import { Trash, Upload } from 'lucide-react'

type Props = {
    element: EditorElement
}

// Type Guards - Data Type Verification
const hasSrc = (content: any): content is { src: string } => {
    return content && typeof content === 'object' && 'src' in content
}

const hasFile = (content: any): content is { file: File } => {
    return content && typeof content === 'object' && 'file' in content
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

    // Function to get audio source safely
    const getAudioSrc = (): string => {
        if (hasSrc(element.content)) {
            return element.content.src
        }
        return ''
    }
//Upload a new audio file    
const getAudioFile = (): File | null => {
        if (hasFile(element.content)) {
            return element.content.file
        }
        return null
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

    const audioSrc = getAudioSrc()
    const audioFile = getAudioFile()

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
            
            {audioSrc ? (
                <div className="p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            {audioFile?.name || 'Audio File'}
                        </span>
                        <span className="text-xs text-gray-500">
                            {audioFile?.size ? `(${(audioFile.size / 1024 / 1024).toFixed(2)} MB)` : ''}
                        </span>
                    </div>
                    <audio 
                        controls 
                        className="w-full"
                        src={audioSrc}
                    >
                        Your browser does not support the audio element.
                    </audio>
                </div>
            ) : (
                <div 
                    className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-white"
                    onClick={triggerFileInput}
                >
                    <Upload size={20} className="text-gray-400 mb-1" />
                    <span className="text-gray-500 text-sm">Upload Audio</span>
                    {isUploading && (
                        <div className="text-blue-500 text-xs mt-1">Uploading...</div>
                    )}
                </div>
            )}
            
            {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
                <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                    <Trash size={16} onClick={handleDeleteElement} className="cursor-pointer" />
                </div>
            )}
        </div>
    )
}

export default AudioComponent