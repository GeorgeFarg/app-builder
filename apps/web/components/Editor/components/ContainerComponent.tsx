'use client'
import { EditorBtns, defaultStyles } from '@/constants/editor'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import clsx from 'clsx'
import React, { useRef, useEffect, useState } from 'react'
import { v4 } from 'uuid'
import Recursive from '../Recursive'
import { Trash, X, Upload } from 'lucide-react'



type Props = { element: EditorElement }

const Container = ({ element }: Props) => {
    const { id, content, name, styles, type } = element
    const { dispatch, state } = useEditor()
    const [dragOver, setDragOver] = useState(false)
    const [insertIndex, setInsertIndex] = useState<number | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const handleMediaUploaded = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { type: mediaType, url, fileName, fileType } = customEvent.detail;

            let elementType: EditorBtns;
            let elementName: string;
            let elementStyles: React.CSSProperties;

            switch (mediaType) {
                case 'image':
                    elementType = 'image';
                    elementName = 'Uploaded Image';
                    elementStyles = {
                        ...defaultStyles,
                        width: '300px',
                        height: '200px',
                        objectFit: 'cover',
                        backgroundColor: '#f0fdf4',
                        border: '2px solid #bbf7d0'
                    };
                    break;
                case 'video':
                    elementType = 'video';
                    elementName = 'Uploaded Video';
                    elementStyles = {
                        ...defaultStyles,
                        width: '400px',
                        height: '300px',
                        backgroundColor: '#f0fdf4',
                        border: '2px solid #bbf7d0'
                    };
                    break;
                case 'audio':
                    elementType = 'audio';
                    elementName = 'Uploaded Audio';
                    elementStyles = {
                        ...defaultStyles,
                        width: '100%',
                        padding: '20px',
                        backgroundColor: '#f0fdf4',
                        border: '2px solid #bbf7d0',
                        borderRadius: '8px'
                    };
                    break;
                case 'link':
                    elementType = 'link';
                    elementName = 'Link';
                    elementStyles = {
                        ...defaultStyles,
                        padding: '12px 20px',
                        backgroundColor: '#f0f9ff',
                        border: '2px solid #bae6fd',
                        borderRadius: '6px',
                        color: '#0369a1',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    };
                    break;
                case 'button':
                    elementType = 'button';
                    elementName = 'Button';
                    elementStyles = {
                        ...defaultStyles,
                        padding: '12px 24px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textAlign: 'center'
                    };
                    break;
                case 'contactForm':
                    elementType = 'contactForm';
                    elementName = 'Contact Form';
                    elementStyles = {
                        ...defaultStyles,
                        padding: '24px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        minHeight: '300px'
                    };
                    break;
                case '2col':
                    elementType = 'TwoColcomponent';
                    elementName = '2 Columns';
                    elementStyles = {
                        ...defaultStyles,
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        padding: '24px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        minHeight: '200px'
                    };
                    break;
                case '3col':
                    elementType = 'ThreeColComponent';
                    elementName = '3 Columns';
                    elementStyles = {
                        ...defaultStyles,
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '16px',
                        padding: '24px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        minHeight: '300px'
                    };
                    break;
                default:
                    return;
            }

            dispatch({
    type: 'ADD_ELEMENT',
    payload: {
        containerId: id,
        elementDetails: {
            content: { src: url },
            id: v4(),
            name: elementName,
            styles: elementStyles,
            type: elementType,
        },
    },
});
        };

        window.addEventListener('mediaUploaded', handleMediaUploaded as EventListener);

        return () => {
            window.removeEventListener('mediaUploaded', handleMediaUploaded as EventListener);
        };
    }, [dispatch, id]);

    const handleOnDrop = (e: React.DragEvent, containerId: string, index?: number) => {
        e.stopPropagation()
        setDragOver(false)
        setInsertIndex(null)

        const componentType = e.dataTransfer.getData('componentType') as EditorBtns

        const newElement = createNewElement(componentType, e)

        if (index !== undefined) {
            dispatch({
                type: 'ADD_ELEMENT',
                payload: {
                    containerId,
                    elementDetails: newElement,
                },
            })
        } else {
            dispatch({
                type: 'ADD_ELEMENT',
                payload: {
                    containerId,
                    elementDetails: newElement,
                },
            })
        }
    }

    const createNewElement = (componentType: EditorBtns, e: React.DragEvent): EditorElement => {
        const baseElement = {
            id: v4(),
            styles: { ...defaultStyles },
            name: '',
            type: componentType,
        }

        switch (componentType) {
            case 'text':
                return {
                    ...baseElement,
                    content: { innerText: 'Text Element' },
                    name: 'Text',
                    type: 'text',
                    styles: {
                        ...defaultStyles,
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        minHeight: '60px',
                        border: '1px solid #e2e8f0',
                        fontSize: '16px',
                        color: '#374151'
                    },
                };


            case 'button':
                const buttonText = e.dataTransfer.getData('buttonText') || 'Click Me'
                return {
                    ...baseElement,
                    content: { innerText: buttonText },
                    name: 'Button',
                    type: 'button',
                    styles: {
                        ...defaultStyles,
                        padding: '12px 24px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textAlign: 'center' as const,
                        display: 'inline-block',
                        minWidth: '120px',
                    },
                };

            case 'image':
                const imageSrc = e.dataTransfer.getData('imageSrc') || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=200&fit=crop'
                const imageAlt = e.dataTransfer.getData('imageAlt') || 'Sample Image'
                return {
                    ...baseElement,
                    content: {
                        src: imageSrc,
                        alt: imageAlt
                    },
                    name: 'Image',
                    type: 'image',
                    styles: {
                        ...defaultStyles,
                        width: '300px',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                    },
                };
            case 'video':
                const videoSrc = e.dataTransfer.getData('videoSrc') || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                return {
                    ...baseElement,
                    content: {
                        src: videoSrc
                    },
                    name: 'Video',
                    type: 'video',
                    styles: {
                        ...defaultStyles,
                        width: '400px',
                        height: '300px',
                        borderRadius: '8px'
                    },
                };

   case 'audio':
    const audioSrc = e.dataTransfer.getData('audioSrc') || 'https://www.soundjay.com/button/beep-07.wav'
    return {
        ...baseElement,
        content: {
            src: audioSrc
        },
        name: 'Audio',
        styles: {
            ...defaultStyles,
            width: '100%',
            padding: '20px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
        },
    } as EditorElement  

            case 'link':
                return {
                    ...baseElement,
                    content: {
                        innerText: 'Link Element',
                        href: 'https://classroom.google.com/',
                    },
                    name: 'Link',
                    type: 'link',
                    styles: {
                        color: 'blue',
                        textDecoration: 'underline',
                        ...defaultStyles,
                        padding: '8px 16px',
                        display: 'inline-block'
                    },
                };



            case 'container':
                return {
                    ...baseElement,
                    content: [],
                    name: 'Container',
                    type: 'container',
                    styles: {
                        ...defaultStyles,
                        minHeight: '120px',
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '2px dashed #cbd5e1'
                    },
                };

        case 'TwoColcomponent':
    return {
        ...baseElement,
        content: [
            {
                id: v4(),
                content: { innerText: ' left_content' },
                name: 'Left Column',
                type: 'container',
                styles: {
                    ...defaultStyles,
                    minHeight: '100%', 
                    height: '100%', 
                    padding: '16px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '2px dashed #7dd3fc',
                    margin: '0', 
                },
            },
            {
                id: v4(),
                content: { innerText: 'right_content ' },
                name: 'Right Column',
                type: 'container',
                styles: {
                    ...defaultStyles,
                    minHeight: '100%',
                    height: '100%',
                    padding: '16px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '8px',
                    border: '2px dashed #86efac',
                    margin: '0',
                },
            }
        ],
        name: 'Two Columns',
        type: 'TwoColcomponent',
        styles: {
            ...defaultStyles,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            minHeight: '200px',
            height: '100%', 
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '2px dashed #cbd5e1',
        
            boxSizing: 'border-box',
        },
    };
            case 'ThreeColComponent':
                return {
                    ...baseElement,
                    content: Array(3).fill(null).map((_, index) => ({
                        id: v4(),
                        content: { innerText: ` ${index + 1}` },
                        name: `Column ${index + 1}`,
                        type: 'container',
                        styles: {
            ...defaultStyles,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',    
            gap: '16px',
            padding: '16px',
            minHeight: '200px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '2px dashed #cbd5e1',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
        },
                    })),
                    name: '3 Columns',
                    type: 'ThreeColComponent',
                    styles: {
                        ...defaultStyles,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '16px',
                        padding: '16px',
                        minHeight: '200px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '2px dashed #cbd5e1'
                    },
                };

      case 'contactForm':
    return {
        ...baseElement,
        content: {
            name: '',
            email: '',
            message: '',
            buttonText: 'Send Message'
        } as any,  
        name: 'Contact Form',
        type: 'contactForm',
        styles: {
            ...defaultStyles,
            minHeight: '300px',
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0', 
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        },
    };
     

           case 'ul':
  return {
    ...baseElement,
    content: {
    
      innerText: 'Unordered List'
      
    },
    name: 'Unordered List',
    type: 'ul',
    styles: {
      ...defaultStyles,
      padding: '16px',
      listStyleType: 'disc',
      marginLeft: '20px'
    },
  }
          case 'ol':
  return {
    ...baseElement,
    content: {
    
      innerText: 'ordered List'
    },
    name: 'ordered List',
    type: 'ol',
    styles: {
      ...defaultStyles,
      padding: '16px',
      marginLeft: '20px'
    },
  }
            default:
                return {
                    ...baseElement,
                    content: { innerText: 'Element' },
                    name: 'Element',
                    type: 'text',
                }
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const imageUrl = event.target?.result as string

                dispatch({
                    type: 'ADD_ELEMENT',
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: {
                                src: imageUrl,
                            },
                            id: v4(),
                            name: 'Uploaded Image',
                            styles: {
                                ...defaultStyles,
                                width: '300px',
                                height: '200px',
                                objectFit: 'cover',
                                backgroundColor: '#f0fdf4',
                                border: '2px solid #bbf7d0'
                            },
                            type: 'image',
                        },
                    },
                })
            }
            reader.readAsDataURL(file)
        }

        if (e.target) e.target.value = ''
    }

    
    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        setInsertIndex(null)
    }

    const handleDragEnter = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        setInsertIndex(index)
    }

    const handleDragStart = (e: React.DragEvent, type: string) => {
        if (type === '__body') return
        e.dataTransfer.setData('componentType', type)
    }

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
            payload: {
                elementDetails: element,
            },
        })
    }

    const handleDeleteChildElement = (childId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (Array.isArray(content)) {
            const updatedContent = content.filter(child => child.id !== childId)

            dispatch({
                type: 'UPDATE_ELEMENT',
                payload: {
                    elementDetails: {
                        ...element,
                        content: updatedContent
                    }
                }
            })
        }
    }

    return (
        <div
            style={styles}
            className={clsx('relative transition-all group', {
                'max-w-full w-full': type === 'container' || type === 'TwoColcomponent' || type === 'ThreeColComponent',
                'h-fit': type === 'container',
                'h-full': type === '__body',
                'p-4': type === 'container' || type === 'TwoColcomponent' || type === 'ThreeColComponent',
                'flex flex-col gap-4': type === 'container',
                'grid grid-cols-2 gap-4': type === 'TwoColcomponent',
                'grid grid-cols-3 gap-4': type === 'ThreeColComponent',
                '!border-blue-500 bg-blue-50': dragOver,
                '!border-blue-500':
                    state.editor.selectedElement.id === id &&
                    !state.editor.liveMode &&
                    state.editor.selectedElement.type !== '__body',
                '!border-yellow-400 !border-4':
                    state.editor.selectedElement.id === id &&
                    !state.editor.liveMode &&
                    state.editor.selectedElement.type === '__body',
                '!border-solid':
                    state.editor.selectedElement.id === id && !state.editor.liveMode,
                'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
            })}
            onDrop={(e) => handleOnDrop(e, id)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            draggable={type !== '__body'}
            onClick={handleOnClickBody}
            onDragStart={(e) => handleDragStart(e, 'container')}
        >
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />

            {!state.editor.liveMode && (
                <button
                    onClick={handleUploadClick}
                    className="absolute top-2 right-2 z-10 p-2 bg-blue-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
                    title="Upload Image"
                >
                    <Upload size={16} />
                </button>
            )}

            {Array.isArray(content) && content.map((childElement, index) => (
                <React.Fragment key={childElement.id}>
                    <div
                        className={clsx('h-2 transition-all', {
                            'bg-blue-300': insertIndex === index,
                            'bg-transparent': insertIndex !== index,
                        })}
                        onDragOver={handleDragOver}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDrop={(e) => handleOnDrop(e, id, index)}
                    />

                    <div className="relative group/child">
                        <Recursive element={childElement} />
                        {!state.editor.liveMode && (
                            <button
                                onClick={(e) => handleDeleteChildElement(childElement.id, e)}
                                className="absolute -top-2 -right-2 z-20 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/child:opacity-100 transition-opacity hover:bg-red-600"
                                title="Delete Element"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>

                    {index === content.length - 1 && (
                        <div
                            className={clsx('h-2 transition-all', {
                                'bg-blue-300': insertIndex === content.length,
                                'bg-transparent': insertIndex !== content.length,
                            })}
                            onDragOver={handleDragOver}
                            onDragEnter={(e) => handleDragEnter(e, content.length)}
                            onDrop={(e) => handleOnDrop(e, id, content.length)}
                        />
                    )}
                </React.Fragment>
            ))}

            {(!Array.isArray(content) || content.length === 0) && (
                <div
                    className="h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm"
                    onDrop={(e) => handleOnDrop(e, id)}
                    onDragOver={handleDragOver}
                >
                    Drop elements here or click upload button
                </div>
            )}

            {state.editor.selectedElement.id === element.id &&
                !state.editor.liveMode &&
                state.editor.selectedElement.type !== '__body' && (
                    <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg">
                        <Trash
                            size={16}
                            onClick={handleDeleteElement}
                            className="cursor-pointer"
                        />
                    </div>
                )}
        </div>
    )
}

export default Container