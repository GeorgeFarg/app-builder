'use client'

import { EditorBtns} from '@/types/Editor';
import { defaultStyles } from '@/constants/editor';
import { EditorElement, useEditor } from '@/providers/editor-provider'
import clsx from 'clsx'
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { v4 } from 'uuid'
import Recursive from '../Recursive'
import { Trash, X, Upload, Move, GripVertical } from 'lucide-react'

// Definition of Type Interfaces 
interface MediaElementContent {
    src: string;
    alt?: string;
}

interface ContactFormContent {
    name: string;
    email: string;
    message: string;
    buttonText: string;
}

interface LinkContent {
    innerText: string;
    href: string;
}

// Element types
type ElementContent = 
    | { innerText: string }
    | MediaElementContent
    | ContactFormContent
    | LinkContent
    | any[];

type Props = { element: EditorElement }

// State Variables
const Container = ({ element }: Props) => {
    const { id, content, name, styles, type } = element
    const { dispatch, state } = useEditor()
    const [dragOver, setDragOver] = useState(false)
    const [insertIndex, setInsertIndex] = useState<number | null>(null)
    const [draggedElement, setDraggedElement] = useState<{id: string, index: number} | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragStartPos, setDragStartPos] = useState({x: 0, y: 0})
    const [dragOffset, setDragOffset] = useState({x: 0, y: 0})
    const fileInputRef = useRef<HTMLInputElement>(null)
    const dragPreviewRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const isRootContainer = type === '__body' || id === 'root'

    // handleMediaUploaded
    const handleMediaUploaded = useCallback((event: Event) => {
        const customEvent = event as CustomEvent;
        
        if (!customEvent.detail || !customEvent.detail.type) {
            console.error('Invalid media upload event:', customEvent.detail);
            return;
        }
        if (event.defaultPrevented) return;
        event.preventDefault();
        
        const { type: mediaType, url, fileName, fileType, targetContainerId } = customEvent.detail;
        
        let elementType: EditorBtns;
        let elementName: string;
        let elementStyles: React.CSSProperties;
        let elementContent: ElementContent;

        switch (mediaType) {
            case 'image':
                elementType = 'image';
                elementName = fileName || 'Uploaded Image';
                elementContent = { src: url, alt: fileName || 'Uploaded Image' };
                elementStyles = {
                    ...defaultStyles,
                    width: '300px',
                    height: '200px',
                    objectFit: 'cover',
                    backgroundColor: '#f0fdf4',
                    border: '2px solid #bbf7d0',
                    borderRadius: '8px'
                };
                break;
            case 'video':
                elementType = 'video';
                elementName = fileName || 'Uploaded Video';
                elementContent = { src: url };
                elementStyles = {
                    ...defaultStyles,
                    width: '400px',
                    height: '300px',
                    backgroundColor: '#f0fdf4',
                    border: '2px solid #bbf7d0',
                    borderRadius: '8px'
                };
                break;
            case 'audio':
                elementType = 'audio';
                elementName = fileName || 'Uploaded Audio';
                elementContent = { src: url };
                elementStyles = {
                    ...defaultStyles,
                    width: '100%',
                    padding: '20px',
                    backgroundColor: '#f0fdf4',
                    border: '2px solid #bbf7d0',
                    borderRadius: '8px'
                };
                break;
          
        
            default:
                console.warn(`Unsupported media type: ${mediaType}`);
                return; }

        dispatch({
            type: 'ADD_ELEMENT',
            payload: {
                containerId: id,
                elementDetails: {
                    content: elementContent,
                    id: v4(),
                    name: elementName,
                    styles: elementStyles,
                    type: elementType,
                },
            },
        });
    }, [dispatch, id, isRootContainer]);

    // event_listener
    useEffect(() => {
        if (isRootContainer) {
            console.log('Root container adding global event listener');
            const eventListener = handleMediaUploaded as EventListener;
            window.addEventListener('mediaUploaded', eventListener);
            
            return () => {
                console.log('Root container removing global event listener');
                window.removeEventListener('mediaUploaded', eventListener);
            };
        }
    }, [handleMediaUploaded, isRootContainer]);

    
    // Handle mouse move for dragging//
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !draggedElement || !dragPreviewRef.current || !containerRef.current) return;

        e.preventDefault();
        const offsetX = e.clientX - dragStartPos.x;
        const offsetY = e.clientY - dragStartPos.y;
        setDragOffset({ x: offsetX, y: offsetY });
        if (dragPreviewRef.current) {
            dragPreviewRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }
        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const mouseY = e.clientY - containerRect.top;
const childElements = Array.from(containerRef.current.children)
    .filter(child => child.getAttribute('data-child-id'));

let newIndex = childElements.length;
let index = 0;

for (const child of childElements) {
    if (!child) {
        index++;
        continue;
    }
    
    const childRect = child.getBoundingClientRect();
    const childMiddle = childRect.top - containerRect.top + childRect.height / 2;
    
    if (mouseY < childMiddle) {
        newIndex = index;
        break;
    }
    
    index++;
}

setInsertIndex(newIndex);
        }
    }, [isDragging, draggedElement, dragStartPos]);

    // Handle mouse up for dropping
    const handleMouseUp = useCallback(() => {
        if (!isDragging || !draggedElement) return;

        setIsDragging(false);
        setDragOffset({ x: 0, y: 0 });
        
        if (dragPreviewRef.current) {
            dragPreviewRef.current.style.display = 'none';
        }

       
if (insertIndex !== null && draggedElement.index !== insertIndex && Array.isArray(content)) {
    const newContent = [...content];
        if (draggedElement.index >= 0 && draggedElement.index < newContent.length) {
        const elementToMove = newContent[draggedElement.index];
        
        if (elementToMove) {
            newContent.splice(draggedElement.index, 1);
            
            const adjustedIndex = Math.min(insertIndex, newContent.length);
            newContent.splice(adjustedIndex, 0, elementToMove);

            dispatch({
                type: 'UPDATE_ELEMENT',
                payload: {
                    elementDetails: {
                        ...element,
                        content: newContent
                    }
                }
            });
        }
    }

        }

        setDraggedElement(null);
        setInsertIndex(null);
    }, [isDragging, draggedElement, insertIndex, content, dispatch, element]);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);


    // handleOnDrop
    const handleOnDrop = (e: React.DragEvent, containerId: string, index?: number) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        setInsertIndex(null);

        const componentType = e.dataTransfer.getData('componentType') as EditorBtns;
        const newElement = createNewElement(componentType, e);
        
        dispatch({
            type: 'ADD_ELEMENT',
            payload: {
                containerId: containerId, 
                elementDetails: newElement,
                index: index
            },
        });

        e.dataTransfer.clearData();
    }

    // Start dragging an element
    const handleDragStartInternal = (e: React.MouseEvent, childId: string, index: number) => {
        if (state.editor.liveMode) return;
        
        e.stopPropagation();
        e.preventDefault();
        
        setIsDragging(true);
        setDragStartPos({ x: e.clientX, y: e.clientY });
        setDraggedElement({ id: childId, index });
        
        // Create drag preview
        if (dragPreviewRef.current && containerRef.current) {
            const childElement = containerRef.current.querySelector(`[data-child-id="${childId}"]`);
            if (childElement) {
                const rect = childElement.getBoundingClientRect();
                dragPreviewRef.current.style.width = `${rect.width}px`;
                dragPreviewRef.current.style.height = `${rect.height}px`;
                dragPreviewRef.current.style.display = 'block';
                dragPreviewRef.current.style.transform = `translate(0px, 0px)`;
            }
        }
    }

    // create new element
    const createNewElement = (componentType: EditorBtns, e: React.DragEvent): EditorElement => {
        const baseElement = {
            id: v4(),
            styles: { ...defaultStyles },
            name: '',
            type: componentType,
        };
        
        baseElement.styles.position = 'relative';
        baseElement.styles.cursor = 'move';

        switch (componentType) {
            case 'text':
                return {
                    ...baseElement,
                    content: { innerText: 'Text Element' },
                    name: 'Text',
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
                const buttonText = e.dataTransfer.getData('buttonText') || 'Click Me';
                return {
                    ...baseElement,
                    content: { innerText: buttonText },
                    name: 'Button',
                    styles: {
                        ...defaultStyles,
                        padding: '12px 24px',
                        backgroundColor: '#3ba2f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'inline-block',
                        minWidth: '120px',
                    },
                };

            case 'image':
                const imageSrc = e.dataTransfer.getData('imageSrc') || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=200&fit=crop';
                const imageAlt = e.dataTransfer.getData('imageAlt') || 'Sample Image';
                return {
                    ...baseElement,
                    content: {
                        src: imageSrc,
                        alt: imageAlt
                    },
                    name: 'Image',
                    styles: {
                        ...defaultStyles,
                        width: '300px',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                    },
                };

            case 'video':
                const videoSrc = e.dataTransfer.getData('videoSrc') || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
                return {
                    ...baseElement,
                    content: {
                        src: videoSrc
                    },
                    name: 'Video',
                    styles: {
                        ...defaultStyles,
                        width: '400px',
                        height: '300px',
                        borderRadius: '8px'
                    },
                };

            case 'audio':
                const audioSrc = e.dataTransfer.getData('audioSrc') || 'https://www.soundjay.com/button/beep-07.wav';
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
                };

            case 'link':
                const linkHref = e.dataTransfer.getData('linkHref') || 'https://example.com';
                const linkText = e.dataTransfer.getData('linkText') || 'Link Element';
                return {
                    ...baseElement,
                    content: {
                        innerText: linkText,
                        href: linkHref,
                    },
                    name: 'Link',
                    styles: {
                        ...defaultStyles,
                        color: 'blue',
                        textDecoration: 'underline',
                        padding: '8px 16px',
                        display: 'inline-block'
                    },
                };

            case 'container':
                return {
                    ...baseElement,
                    content: [],
                    name: 'Container',
                    styles: {
                        ...defaultStyles,
                        minHeight: '200px',
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
                            content: { innerText: 'Left Column Content' },
                            name: 'Left Column',
                            type: 'container',
                            styles: {
                                ...defaultStyles,
                                minHeight: '150px',
                                padding: '16px',
                                backgroundColor: '#f0f9ff',
                                borderRadius: '8px',
                                border: '2px dashed #7dd3fc',
                            },
                        },
                        {
                            id: v4(),
                            content: { innerText: 'Right Column Content' },
                            name: 'Right Column',
                            type: 'container',
                            styles: {
                                ...defaultStyles,
                                minHeight: '150px',
                                padding: '16px',
                                backgroundColor: '#f0fdf4',
                                borderRadius: '8px',
                                border: '2px dashed #86efac',
                            },
                        }
                    ],
                    name: 'Two Columns',
                    styles: {
                        ...defaultStyles,
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        minHeight: '200px',
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '2px dashed #cbd5e1',
                        width: '100%',
                        boxSizing: 'border-box',
                    },
                };

            case 'ThreeColComponent':
                return {
                    ...baseElement,
                    content: Array(3).fill(null).map((_, index) => ({
                        id: v4(),
                        content: { innerText: `Column ${index + 1} Content` },
                        name: `Column ${index + 1}`,
                        type: 'container',
                        styles: {
                            ...defaultStyles,
                            minHeight: '150px',
                            padding: '16px',
                            backgroundColor: index === 0 ? '#f0f9ff' : 
                                          index === 1 ? '#fef7cd' : 
                                          '#f0fdf4',
                            borderRadius: '8px',
                            border: `2px dashed ${index === 0 ? '#7dd3fc' : 
                                                index === 1 ? '#fcd34d' : 
                                                '#86efac'}`,
                        },
                    })),
                    name: '3 Columns',
                    styles: {
                        ...defaultStyles,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '16px',
                        padding: '16px',
                        minHeight: '200px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '2px dashed #cbd5e1',
                        width: '100%'
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
                    },
                    name: 'Contact Form',
                    styles: {
                        ...defaultStyles,
                        minHeight: '300px',
                        padding: '24px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        width: '100%'
                    },
                };

            case 'ul':
                return {
                    ...baseElement,
                    content: [
                        {
                            id: v4(),
                            content: { innerText: 'List Item 1' },
                            name: 'List Item',
                            type: 'text',
                            styles: {
                                ...defaultStyles,
                                padding: '8px 0',
                                marginLeft: '20px',
                                listStyleType: 'disc'
                            },
                        }
                    ],
                    name: 'Unordered List',
                    styles: {
                        ...defaultStyles,
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        minHeight: '100px'
                    },
                };

            case 'ol':
                return {
                    ...baseElement,
                    content: [
                        {
                            id: v4(),
                            content: { innerText: 'List Item 1' },
                            name: 'List Item',
                            type: 'text',
                            styles: {
                                ...defaultStyles,
                                padding: '8px 0',
                                marginLeft: '20px'
                            },
                        }
                    ],
                    name: 'Ordered List',
                    styles: {
                        ...defaultStyles,
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        minHeight: '100px'
                    },
                };

            default:
                console.warn(`Unsupported component type: ${componentType}`);
                return {
                    ...baseElement,
                    content: { innerText: 'Element' },
                    name: 'Element',
                };
        }
    }

    // handleFileUpload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (!file) return;
        
        let fileType: 'image' | 'video' | 'audio' | null = null;
        let elementType: EditorBtns;
        
        if (file.type.startsWith('image/')) {
            fileType = 'image';
            elementType = 'image';
        } else if (file.type.startsWith('video/')) {
            fileType = 'video';
            elementType = 'video';
        } else if (file.type.startsWith('audio/')) {
            fileType = 'audio';
            elementType = 'audio';
        } else {
            alert('Please upload an image, video, or audio file');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const fileUrl = event.target?.result as string;

            let elementStyles: React.CSSProperties;
            let elementContent: ElementContent;

            switch (fileType) {
                case 'image':
                    elementContent = {
                        src: fileUrl,
                        alt: file.name
                    };
                    elementStyles = {
                        ...defaultStyles,
                        width: '300px',
                        height: '200px',
                        objectFit: 'cover',
                        backgroundColor: '#f0fdf4',
                        border: '2px solid #bbf7d0',
                        borderRadius: '8px'
                    };
                    break;
                case 'video':
                    elementContent = {
                        src: fileUrl
                    };
                    elementStyles = {
                        ...defaultStyles,
                        width: '400px',
                        height: '300px',
                        backgroundColor: '#f0fdf4',
                        border: '2px solid #bbf7d0',
                        borderRadius: '8px'
                    };
                    break;
                case 'audio':
                    elementContent = {
                        src: fileUrl
                    };
                    elementStyles = {
                        ...defaultStyles,
                        width: '100%',
                        padding: '20px',
                        backgroundColor: '#f0fdf4',
                        border: '2px solid #bbf7d0',
                        borderRadius: '8px'
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
                        content: elementContent,
                        id: v4(),
                        name: file.name || `Uploaded ${fileType}`,
                        styles: elementStyles,
                        type: elementType,
                    },
                },
            });
        };

        reader.onerror = () => {
            alert('Error reading file. Please try again.');
        };

        reader.readAsDataURL(file);
        if (e.target) e.target.value = '';
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    }

    // Handling withdrawal events
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        setInsertIndex(null);
    }

    const handleDragEnter = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        setInsertIndex(index);
    }

    const handleDragStart = (e: React.DragEvent, elementType: string) => {
        if (elementType === '__body') return;
        e.dataTransfer.setData('componentType', elementType);
        e.dataTransfer.effectAllowed = 'move';
    }

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: {
                elementDetails: element,
            },
        });
    }

    // Click and delete handling
    const handleDeleteElement = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({
            type: 'DELETE_ELEMENT',
            payload: {
                elementDetails: element,
            },
        });
    }

    const handleDeleteChildElement = (childId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (Array.isArray(content)) {
            const updatedContent = content.filter(child => child.id !== childId);

            dispatch({
                type: 'UPDATE_ELEMENT',
                payload: {
                    elementDetails: {
                        ...element,
                        content: updatedContent
                    }
                }
            });
        }
    }

    const isContentArray = Array.isArray(content);
    const isListContainer = type === 'ul' || type === 'ol';

    return (
        <div
            ref={containerRef}
            style={styles}
            className={clsx('relative transition-all group', {
                'w-full': type === 'container' || type === 'TwoColcomponent' || type === 'ThreeColComponent' || type === 'ul' || type === 'ol',
                'h-fit': type === 'container' || type === 'ul' || type === 'ol',
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
            onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOnDrop(e, id);
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            draggable={type !== '__body'}
            onClick={handleOnClickBody}
            data-container-id={id}
        >
            {/* Drag Preview */}
            <div
                ref={dragPreviewRef}
                className="fixed top-0 left-0 z-50 pointer-events-none bg-white border-2 border-blue-500 rounded-lg shadow-xl opacity-70 hidden"
                style={{
                    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.2s',
                }}
            >
                <div className="w-full h-full flex items-center justify-center bg-blue-50 rounded">
                    <Move size={24} className="text-blue-500" />
                    <span className="ml-2 text-blue-500 font-medium">Moving...</span>
                </div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*,audio/*,.png,.jpg,.jpeg,.gif,.webp,.mp4,.mov,.avi,.wmv,.flv,.mp3,.wav,.ogg"
                onChange={handleFileUpload}
                className="hidden"
            />

            {!state.editor.liveMode && type !== '__body' && (
                <button
                    onClick={handleUploadClick}
                    className="absolute top-2 right-2 z-10 p-2 bg-blue-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600 shadow-md"
                    title="Upload Image/Video/Audio"
                    type="button"
                >
                    <Upload size={16} />
                </button>
            )}

            {isContentArray && content.map((childElement, index) => (
                <React.Fragment key={childElement.id}>
                    {/* Insert Indicator */}
                    {!isListContainer && (
                        <div
                            className={clsx('h-2 transition-all duration-200', {
                                'bg-blue-500': insertIndex === index,
                                'bg-transparent': insertIndex !== index,
                            })}
                            onDragOver={handleDragOver}
                            onDragEnter={(e) => handleDragEnter(e, index)}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleOnDrop(e, id, index);
                            }}
                        />
                    )}

                    <div 
                        className="relative group/child"
                        data-child-id={childElement.id}
                    >
                        {/* Drag Handle */}
                        {!state.editor.liveMode && !isListContainer && (
                            <div
                                className="absolute -left-8 top-1/2 transform -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing opacity-0 group-hover/child:opacity-100 transition-opacity"
                                onMouseDown={(e) => handleDragStartInternal(e, childElement.id, index)}
                                title="Drag to reorder"
                            >
                                <GripVertical size={20} className="text-gray-400 hover:text-gray-600" />
                            </div>
                        )}

                        {/* Element being dragged indicator */}
                        {draggedElement?.id === childElement.id && (
                            <div className="absolute inset-0 border-2 border-dashed border-blue-500 bg-blue-50 opacity-50 rounded-lg z-10" />
                        )}

                        <Recursive element={childElement} />
                        
                        {!state.editor.liveMode && (
                            <button
                                onClick={(e) => handleDeleteChildElement(childElement.id, e)}
                                className="absolute -top-2 -right-2 z-20 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/child:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                                title="Delete Element"
                                type="button"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                    
                    {/* Last insert indicator */}
                    {!isListContainer && index === content.length - 1 && (
                        <div
                            className={clsx('h-2 transition-all duration-200', {
                                'bg-blue-500': insertIndex === content.length,
                                'bg-transparent': insertIndex !== content.length,
                            })}
                            onDragOver={handleDragOver}
                            onDragEnter={(e) => handleDragEnter(e, content.length)}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleOnDrop(e, id, content.length);
                            }}
                        />
                    )}
                </React.Fragment>
            ))}
        
            {/* empty_container */}
            {(!isContentArray || content.length === 0) && (
                <div
                    className="h-80 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 text-sm p-4 gap-2"
                    onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOnDrop(e, id);
                    }}
                    onDragOver={handleDragOver}
                >
                    <span>Drop elements here</span>
                    <span className="text-xs">or</span>
                    <button
                        onClick={handleUploadClick}
                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                        type="button"
                    >
                        Upload Media
                    </button>
                </div>
            )}

            {state.editor.selectedElement.id === element.id &&
                !state.editor.liveMode &&
                state.editor.selectedElement.type !== '__body' && (
                    <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg">
                        <Trash
                            size={16}
                            onClick={handleDeleteElement}
                            className="cursor-pointer hover:text-red-600 transition-colors"
                        />
                    </div>
                )}
        </div>
    )
}

export default Container