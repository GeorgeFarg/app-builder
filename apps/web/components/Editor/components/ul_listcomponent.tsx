'use client'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import React, { useState } from 'react'

interface Props {
    element: EditorElement
}

type BulletType = 'dot' | 'circle' | 'square' | 'dash' | 'check' | 'star'

const ULComponent = (props: Props) => {
    const { dispatch, state } = useEditor()
    const [isEditing, setIsEditing] = useState(false)
    const [listItems, setListItems] = useState<string[]>([])
    const [bulletType, setBulletType] = useState<BulletType>('dot')

    React.useEffect(() => {
    const content = props.element.content as { items?: string[]; bulletType?: BulletType }
    if (content && typeof content === 'object') {
        setListItems(content.items || ['First item', 'Second item', 'Third item'])
        setBulletType(content.bulletType || 'dot')
    }
}, [props.element.content])

    const handleSave = () => {
        dispatch({
            type: 'UPDATE_ELEMENT',
            payload: {
                elementDetails: {
                    ...props.element,
                    content: {
                        ...props.element.content,
                        items: listItems,
                     
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

    const getBulletSymbol = (type: BulletType): string => {
        switch (type) {
            case 'dot': return '•'
            case 'circle': return '○'
            case 'square': return '■'
            case 'dash': return '–'
            case 'check': return '✓'
            case 'star': return '★'
            default: return '•'
        }
    }

    if (isEditing && !state.editor.liveMode) {
        return (
            <div style={props.element.styles} className="p-4 border border-purple-300 rounded-lg bg-white shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Edit Unordered List</h3>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>

                {/* Bullet Type Selector */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bullet Style</label>
                    <div className="flex gap-2 flex-wrap">
                        {(['dot', 'circle', 'square', 'dash', 'check', 'star'] as BulletType[]).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setBulletType(type)}
                                className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                                    bulletType === type 
                                    ? 'bg-purple-100 border-purple-500 text-purple-700' 
                                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {getBulletSymbol(type)} {type}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="space-y-3">
                    {listItems.map((item: string, index: number) => (
                        <div key={index} className="flex gap-3 items-center">
                            <span className="text-purple-600 w-6 text-sm font-bold">
                                {getBulletSymbol(bulletType)}
                            </span>
                            <input
                                type="text"
                                value={item}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleItemChange(index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="Enter list item"
                            />
                            <button
                                onClick={() => handleRemoveItem(index)}
                                className="px-3 py-2 bg-rose-500 text-white rounded-lg text-sm hover:bg-rose-600 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                
                <button
                    onClick={handleAddItem}
                    className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 w-full transition-colors font-medium"
                >
                    + Add New Item
                </button>
            </div>
        )
    }
    

    const content = props.element.content
    const items = (content && typeof content === 'object' && 'items' in content) 
        ? content.items 
        : ['First item', 'Second item', 'Third item']
    
    const currentBulletType = (content && typeof content === 'object' && 'bulletType' in content) 
        ? (content as any).bulletType as BulletType 
        : 'dot'

    return (
    <ul 
    style={props.element.styles}
    onClick={handleClick}
    className={`cursor-pointer ${!state.editor.liveMode ? 'hover:bg-purple-50 rounded-lg p-3 transition-colors' : ''}`}
>
    {(props.element.content as { items: string[] }).items?.map((item, index) => (
        <li key={index} className="mb-2 text-gray-700 hover:text-purple-600 transition-colors flex items-start">
            <span className="text-purple-600 mr-2 mt-1">
                {getBulletSymbol(currentBulletType)}
            </span>
            <span>{item}</span>
        </li>
    ))}
</ul>
    )
}

export default ULComponent