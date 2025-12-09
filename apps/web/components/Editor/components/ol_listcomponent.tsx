'use client'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import React, { useState, useEffect } from 'react'

interface Props {
    element: EditorElement
}

const OLComponent = (props: Props) => {
    const { dispatch, state } = useEditor()
    const [isEditing, setIsEditing] = useState(false)
    const [listItems, setListItems] = useState<string[]>([])

    useEffect(() => {
        const content = props.element.content
        if (content && typeof content === 'object' && 'items' in content) {
            const items = (content as any).items as string[]
            setListItems(items || ['First item', 'Second item', 'Third item'])
        } else {
            setListItems(['First item', 'Second item', 'Third item'])
        }
    }, [props.element.content])

    const handleSave = () => {
        dispatch({
            type: 'UPDATE_ELEMENT',
            payload: {
                elementDetails: {
                    ...props.element,
                    content: {
                        items: listItems
                    }
                }
            }
        })
        setIsEditing(false)
    }

    const handleAddItem = () => {
        setListItems(prev => [...prev, `New item ${prev.length + 1}`])
    }

    const handleRemoveItem = (index: number) => {
        if (listItems.length > 1) {
            setListItems(prev => prev.filter((_, i) => i !== index))
        }
    }

    const handleItemChange = (index: number, value: string) => {
        setListItems(prev => prev.map((item, i) => i === index ? value : item))
    }

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!state.editor.liveMode) {
            setIsEditing(true)
        }
    }

    if (isEditing && !state.editor.liveMode) {
        return (
            <div style={{ 
                ...props.element.styles,
                backgroundColor: '#ffffff',
                border: '2px solid #3b82f6',
                borderRadius: '8px',
                padding: '16px'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '12px' 
                }}>
                    <h3 style={{ 
                        fontWeight: '600', 
                        color: '#374151',
                        margin: 0
                    }}>
                        Edit Ordered List
                    </h3>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: '6px 12px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Save
                    </button>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                    {listItems.map((item, index) => (
                        <div key={index} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            marginBottom: '8px'
                        }}>
                            <span style={{ 
                                color: '#6b7280',
                                width: '24px',
                                textAlign: 'right'
                            }}>
                                {index + 1}.
                            </span>
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => handleItemChange(index, e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="List item"
                            />
                            <button
                                onClick={() => handleRemoveItem(index)}
                                style={{
                                    padding: '8px 12px',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                
                <button
                    onClick={handleAddItem}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        width: '100%'
                    }}
                >
                    + Add New Item
                </button>
            </div>
        )
    }

    return (
        <ol 
            style={{
                ...props.element.styles,
                listStyleType: 'decimal',
                paddingLeft: '24px',
                margin: 0
            }} 
            onClick={handleClick}
        >
            {listItems.map((item, index) => (
                <li 
                    key={index} 
                    style={{
                        marginBottom: '4px',
                        padding: '2px 0'
                    }}
                >
                    {item}
                </li>
            ))}
        </ol>
    )
}

export default OLComponent