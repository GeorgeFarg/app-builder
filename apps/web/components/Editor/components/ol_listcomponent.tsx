'use client'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import React, { useState } from 'react'

interface Props {
    element: EditorElement
}

const OLComponent = (props: Props) => {
    const { dispatch, state } = useEditor()
    const [isEditing, setIsEditing] = useState(false)
    const [listItems, setListItems] = useState<string[]>([])

    React.useEffect(() => {
        const content = props.element.content
        if (content && typeof content === 'object' && 'items' in content) {
            const items = (content as any).items as string[]
            setListItems(items || ['First item', 'Second item', 'Third item'])
        }
    }, [props.element.content])

    const handleSave = () => {
        dispatch({
            type: 'UPDATE_ELEMENT',
            payload: {
                elementDetails: {
                    ...props.element,
                    content: {
                        ...(props.element.content as any),
                        items: listItems
                    }
                }
            }
        })
        setIsEditing(false)
    }

    const handleAddItem = () => {
        setListItems(prev => [...prev, 'New item'])
    }

    const handleRemoveItem = (index: number) => {
        setListItems(prev => prev.filter((_, i) => i !== index))
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

    // Get items for display
    const getDisplayItems = (): string[] => {
        const content = props.element.content
        if (content && typeof content === 'object' && 'items' in content) {
            return (content as any).items as string[] || ['First item', 'Second item', 'Third item']
        }
        return ['First item', 'Second item', 'Third item']
    }

    const displayItems = getDisplayItems()

    if (isEditing && !state.editor.liveMode) {
        return (
            <div style={props.element.styles} className="p-4 border border-blue-300 rounded-lg bg-white">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">Edit Ordered List</h3>
                    <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
                
                <div className="space-y-2">
                    {listItems.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <span className="text-gray-500 w-6 text-sm">{index + 1}.</span>
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => handleItemChange(index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="List item"
                            />
                            <button
                                onClick={() => handleRemoveItem(index)}
                                className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                
                <button
                    onClick={handleAddItem}
                    className="mt-3 px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 w-full"
                >
                    + Add New Item
                </button>
            </div>
        )
    }

    return (
        <ol 
            style={props.element.styles} 
            onClick={handleClick}
            className={`cursor-pointer ${!state.editor.liveMode ? 'hover:bg-blue-50 rounded p-2' : ''}`}
        >
            {displayItems.map((item, index) => (
                <li key={index} className="mb-1">{item}</li>
            ))}
        </ol>
    )
}

export default OLComponent