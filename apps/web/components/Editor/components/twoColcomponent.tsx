'use client'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import React, { useState } from 'react'
import Recursive from '../Recursive'
import { Plus, Trash } from 'lucide-react'

type Props = {
    element: EditorElement
}

const TwoColComponent = (props: Props) => {
    const { dispatch, state } = useEditor()
    const [dragOver, setDragOver] = useState<string | null>(null)

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: {
                elementDetails: props.element,
            },
        })
    }

    const handleOnDrop = (e: React.DragEvent, columnId: string) => {
        e.stopPropagation()
        setDragOver(null)
        
        const componentType = e.dataTransfer.getData('componentType') as string

        const newElement: EditorElement = {
            id: Math.random().toString(36).substr(2, 9),
            content: { innerText: 'New Element' },
            name: 'Element',
            styles: { 
                padding: '10px',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                marginBottom: '8px'
            },
            type: componentType as any,
        }

        if (props.element.content && Array.isArray(props.element.content)) {
            const updatedContent = props.element.content.map(column => {
                if (column.id === columnId) {
                    const updatedColumnContent = Array.isArray(column.content) 
                        ? [...column.content, newElement]
                        : [newElement]
                    
                    return {
                        ...column,
                        content: updatedColumnContent
                    }
                }
                return column
            })

            dispatch({
                type: 'UPDATE_ELEMENT',
                payload: {
                    elementDetails: {
                        ...props.element,
                        content: updatedContent
                    }
                }
            })
        }
    }

    const handleDragOver = (e: React.DragEvent, columnId: string) => {
        e.preventDefault()
        setDragOver(columnId)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(null)
    }

    const handleDeleteElement = (columnId: string, elementId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        
        if (props.element.content && Array.isArray(props.element.content)) {
            const updatedContent = props.element.content.map(column => {
                if (column.id === columnId && Array.isArray(column.content)) {
                    return {
                        ...column,
                        content: column.content.filter(item => item.id !== elementId)
                    }
                }
                return column
            })

            dispatch({
                type: 'UPDATE_ELEMENT',
                payload: {
                    elementDetails: {
                        ...props.element,
                        content: updatedContent
                    }
                }
            })
        }
    }

    const handleAddColumn = (e: React.MouseEvent) => {
        e.stopPropagation()
        
        const newColumn: EditorElement = {
            id: Math.random().toString(36).substr(2, 9),
            content: [],
            name: 'Column',
            styles: { 
                minHeight: '200px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '2px dashed #cbd5e1'
            },
            type: 'container',
        }

        const updatedContent = Array.isArray(props.element.content) 
            ? [...props.element.content, newColumn]
            : [newColumn]

        dispatch({
            type: 'UPDATE_ELEMENT',
            payload: {
                elementDetails: {
                    ...props.element,
                    content: updatedContent
                }
            }
        })
    }

    return (
        <div
            style={props.element.styles}
            className="relative transition-all group"
            onClick={handleOnClickBody}
        >
            {!state.editor.liveMode && (
                <button
                    onClick={handleAddColumn}
                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 p-2 bg-blue-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600 z-10"
                    title="Add Column"
                >
                    <Plus size={16} />
                </button>
            )}

            <div className="flex gap-5 h-full">
                {props.element.content && Array.isArray(props.element.content) && 
                 props.element.content.map((column, index) => (
                    <div 
                        key={column.id} 
                        style={column.styles}
                        className={`
                            flex-1 relative transition-all
                            ${dragOver === column.id ? 'bg-blue-50 border-blue-300' : ''}
                            ${!state.editor.liveMode ? 'min-h-[200px]' : ''}
                        `}
                        onDrop={(e) => handleOnDrop(e, column.id)}
                        onDragOver={(e) => handleDragOver(e, column.id)}
                        onDragLeave={handleDragLeave}
                    >
                        {Array.isArray(column.content) && column.content.map((childElement) => (
                            <div key={childElement.id} className="relative group/child mb-2">
                                <Recursive element={childElement} />
                                
                                {!state.editor.liveMode && (
                                    <button
                                        onClick={(e) => handleDeleteElement(column.id, childElement.id, e)}
                                        className="absolute -top-2 -right-2 z-20 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/child:opacity-100 transition-opacity hover:bg-red-600"
                                        title="Delete Element"
                                    >
                                        <Trash size={12} />
                                    </button>
                                )}
                            </div>
                        ))}

                        {(!Array.isArray(column.content) || column.content.length === 0) && (
                            <div
                                className="h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm"
                                onDrop={(e) => handleOnDrop(e, column.id)}
                                onDragOver={(e) => handleDragOver(e, column.id)}
                            >
                                Drop elements here
                            </div>
                        )}

                        {!state.editor.liveMode && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    const updatedContent = props.element.content && Array.isArray(props.element.content) 
                                        ? props.element.content.filter(col => col.id !== column.id)
                                        : []
                                    dispatch({
                                        type: 'UPDATE_ELEMENT',
                                        payload: {
                                            elementDetails: {
                                                ...props.element,
                                                content: updatedContent
                                            }
                                        }
                                    })
                                }}
                                className="absolute -top-2 -right-2 z-10 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                title="Delete Column"
                            >
                                <Trash size={12} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TwoColComponent