'use client'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import clsx from 'clsx'
import { Trash, ExternalLink, Link } from 'lucide-react'
import React, { useState, useEffect } from 'react'

type Props = {
    element: EditorElement
}

const LinkComponent = (props: Props) => {
    const { dispatch, state } = useEditor()
    const [isEditing, setIsEditing] = useState(false)
    const [linkData, setLinkData] = useState({
        href: '',
        innerText: 'Add your link'
    })

    // Initialize link data from element content
    useEffect(() => {
        if (!Array.isArray(props.element.content)) {
            setLinkData({
                href: props.element.content?.href || '',
                innerText: props.element.content?.innerText || 'Add your link'
            });
        }
    }, [props.element.content]);

    const handleDeleteElement = () => {
        dispatch({
            type: 'DELETE_ELEMENT',
            payload: { elementDetails: props.element },
        })
    }

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: { elementDetails: props.element },
        })
        
        if (!state.editor.liveMode && !isEditing) {
            setIsEditing(true)
        }
    }

    const handleSaveLink = () => {
        let finalHref = linkData.href.trim()
        if (finalHref && !finalHref.startsWith('http://') && !finalHref.startsWith('https://')) {
            finalHref = 'https://' + finalHref
        }

        dispatch({
            type: 'UPDATE_ELEMENT',
            payload: {
                elementDetails: {
                    ...props.element,
                    content: {
                        href: finalHref,
                        innerText: linkData.innerText || 'Link',
                    },
                },
            },
        })
        setIsEditing(false)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveLink()
        }
        if (e.key === 'Escape') {
            setIsEditing(false)
        }
    }

    const handleLinkClick = (e: React.MouseEvent) => {
        if (!state.editor.liveMode) {
            e.preventDefault()
            e.stopPropagation()
            if (!isEditing) {
                setIsEditing(true)
            }
            return
        }

        if (state.editor.liveMode) {
            if (!linkData.href) {
                e.preventDefault()
                e.stopPropagation()
                return
            }
            
            let url = linkData.href
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url
            }
            
            window.open(url, '_blank', 'noopener,noreferrer')
            e.preventDefault()
            e.stopPropagation()
        }
    }

    const styles = props.element.styles

    return (
        <div
            style={styles}
            className={clsx('p-[2px] w-full m-[5px] relative transition-all', {
                '!border-blue-500': state.editor.selectedElement.id === props.element.id,
                '!border-solid': state.editor.selectedElement.id === props.element.id,
                'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
            })}
            onClick={handleOnClickBody}
        >
            {isEditing && !state.editor.liveMode ? (
                <div className="p-3 bg-white border border-blue-300 rounded shadow-lg min-w-[300px]">
                    <div className="flex items-center gap-2 mb-3">
                        <Link size={16} className="text-blue-500" />
                        <h3 className="font-semibold text-sm">Edit Link</h3>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Link Text</label>
                            <input
                                type="text"
                                value={linkData.innerText}
                                onChange={(e) => setLinkData(prev => ({...prev, innerText: e.target.value}))}
                                placeholder="Enter link text"
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">URL</label>
                            <input
                                type="url"
                                value={linkData.href}
                                onChange={(e) => setLinkData(prev => ({...prev, href: e.target.value}))}
                                placeholder="https://example.com"
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                onKeyPress={handleKeyPress}
                            />
                        
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveLink}
                                disabled={!linkData.href.trim()}
                                className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <a 
                    href={linkData.href ? (linkData.href.startsWith('http') ? linkData.href : `https://${linkData.href}`) : '#'}
                    target={linkData.href ? "_blank" : "_self"}
                    rel={linkData.href ? "noopener noreferrer" : ""}
                    onClick={handleLinkClick}
                    className={clsx(
                        "flex items-center gap-2 p-2 rounded transition-colors no-underline",
                        {
                            "text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200": linkData.href,
                            "text-gray-500 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300": !linkData.href,
                            "cursor-pointer": true,
                        }
                    )}
                >
                    <Link size={16} />
                    <span className="font-medium">{linkData.innerText}</span>
                    {linkData.href && <ExternalLink size={12} />}
                </a>
            )}
            
            {state.editor.selectedElement.id === props.element.id &&
                !state.editor.liveMode && (
                    <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                        <Trash
                            className="cursor-pointer"
                            size={16}
                            onClick={handleDeleteElement}
                        />
                    </div>
                )}
        </div>
    )
}

export default LinkComponent