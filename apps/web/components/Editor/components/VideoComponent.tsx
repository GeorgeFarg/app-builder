'use client'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import React, { useState, useRef } from 'react'
import { Trash, Play } from 'lucide-react'

type Props = {
    element: EditorElement
}

// Type guard function
const hasSrc = (content: any): content is { src: string } => {
    return content && typeof content === 'object' && 'src' in content
}

const VideoComponent = ({ element }: Props) => {
    const { dispatch, state } = useEditor()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    
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

    // Function to get video source safely
    const getVideoSrc = (): string => {
        if (hasSrc(element.content)) {
            return element.content.src
        }
        return ''
    }

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Handle video upload logic here
        const file = e.target.files?.[0]
        if (file) {
            setIsUploading(true)
            // Simulate upload process
            setTimeout(() => {
                const videoUrl = URL.createObjectURL(file)
                // Update element with new video source
                dispatch({
                    type: 'UPDATE_ELEMENT',
                    payload: {
                        elementDetails: {
                            ...element,
                            content: {
                                ...element.content,
                                src: videoUrl
                            }
                        }
                    }
                })
                setIsUploading(false)
            }, 1000)
        }
    }

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const videoSrc = getVideoSrc()

    return (
        <div
            style={element.styles}
            className="relative p-[2px] transition-all"
            onClick={handleOnClickBody}
        >
            {videoSrc ? (
                <div className="relative">
                    <video 
                        ref={videoRef}
                        src={videoSrc} 
                        className="w-full h-auto object-contain rounded-lg"
                        style={element.styles}
                        controls={state.editor.liveMode}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                    {!state.editor.liveMode && (
                        <button
                            onClick={handlePlayPause}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3 text-white hover:bg-opacity-70 transition-all"
                        >
                            <Play 
                                size={24} 
                                className={isPlaying ? 'hidden' : ''} 
                                fill="white"
                            />
                        </button>
                    )}
                </div>
            ) : (
                <div 
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Play size={32} className="mb-2" />
                    <span>Click to upload video</span>
                    {isUploading && (
                        <div className="mt-2 text-sm text-blue-500">Uploading...</div>
                    )}
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
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
            />
        </div>
    )
}

export default VideoComponent