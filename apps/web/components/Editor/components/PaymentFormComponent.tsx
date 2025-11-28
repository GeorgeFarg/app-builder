'use client'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import React from 'react'
import { Trash, CreditCard } from 'lucide-react'

type Props = { element: EditorElement }

const PaymentForm = ({ element }: Props) => {
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
                <div className="flex items-center justify-center mb-4">
                    <CreditCard className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-center"> pay</h3>
                </div>
                <div className="space-y-3">
                    <input 
                        type="text" 
                        placeholder="number" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    <input 
                        type="text" 
                        placeholder="name" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <input 
                            type="text" 
                            placeholder="MM/YY" 
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                        <input 
                            type="text" 
                            placeholder="CVV" 
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                    <button className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors">
                        Pay now
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

export default PaymentForm