'use client'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import React from 'react'

type Props = {
    element: EditorElement
}

const LinkComponent = (props: Props) => {
    const { dispatch, state } = useEditor()

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
    }

    const styles = props.element.styles

    const content = props.element.content
    const href = typeof content === 'object' && content !== null && 'href' in content ? content.href : '#'
    const innerText = typeof content === 'object' && content !== null && 'innerText' in content ? content.innerText : 'Link'

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
            <a 
                href={state.editor.liveMode ? href : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
                contentEditable={!state.editor.liveMode}
                suppressContentEditableWarning
                onBlur={(e) => {
                    const linkElement = e.target as HTMLAnchorElement
                    dispatch({
                        type: 'UPDATE_ELEMENT',
                        payload: {
                            elementDetails: {
                                ...props.element,
                                content: {
                                    href: href,
                                    innerText: linkElement.innerText,
                                },
                            },
                        },
                    })
                }}
            >
                {innerText}
            </a>
            
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