'use client'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import React, { useState, useRef } from 'react'
import { Trash } from 'lucide-react'

type Props = {
    element: EditorElement
}

// Type guard function
const hasSrc = (content: any): content is { src: string } => {
    return content && typeof content === 'object' && 'src' in content
}

const ImageComponent = ({ element }: Props) => {
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

    // Function to get image source safely
    const getImageSrc = (): string => {
        if (hasSrc(element.content)) {
            return element.content.src
        }
        return ''
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Handle image upload logic here
    }

    const imageSrc = getImageSrc()

    return (
        <div
            style={element.styles}
            className="relative p-[2px] transition-all"
            onClick={handleOnClickBody}
        >
            {imageSrc ? (
                <img 
                    src={imageSrc} 
                    alt="Uploaded" 
                    className="w-full h-auto object-contain"
                    style={element.styles}
                />
            ) : (
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-gray-500">
                    <span>Click to upload image</span>
                </div>
            )}

            {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
                <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                    <Trash
                        className="cursor-pointer"
                        size={16}
                        onClick={handleDeleteElement}
                    />
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
        </div>
    )
}

export default ImageComponent