"use client";

import { useEditor} from '@/providers/editor-provider';
import { EditorElement } from '@/providers/editor-provider';
import type { EditorBtns } from  '@/types/Editor';
import { v4 as uuid } from 'uuid';
import Recursive from './Recursive';

export default function EditorCanvas() {
  const { state, dispatch } = useEditor();
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType') as EditorBtns;
    if (!componentType) return;

    const newElement = createNewElement(componentType, e);

    dispatch({
      type: 'ADD_ELEMENT',
      payload: {
        containerId: '__body',
        elementDetails: newElement,
      },
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCanvasClick = () => {
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {},
    });
  };
  
  const handleElementClick = (e: React.MouseEvent, element: EditorElement) => {
  e.stopPropagation();
  dispatch({
    type: 'CHANGE_CLICKED_ELEMENT',
    payload: {
      elementDetails: element,
    },
  });
 };
  
  const createNewElement = (componentType: EditorBtns, e: React.DragEvent): EditorElement => {
    const id = uuid();
    
    const defaultStyles: React.CSSProperties = {
  margin: '0',
  padding: '0',
  boxSizing: 'border-box',
  position: 'relative',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  color: 'inherit',
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  textDecoration: 'none',
  listStyle: 'none',
};

    switch (componentType) {
      case 'text':
        return {
          id,
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
        return {
          id,
          content: { innerText: e.dataTransfer.getData('buttonText') || 'Click Me' },
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
            textAlign: 'center',
            display: 'inline-block',
          },
        };

      case 'image':
        return {
          id,
          content: {
            src: e.dataTransfer.getData('imageSrc') || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=200&fit=crop',
            alt: e.dataTransfer.getData('imageAlt') || 'Sample Image'
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
        return {
          id,
          content: {
            src: e.dataTransfer.getData('videoSrc') || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
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
        return {
          id,
          content: {
            src: e.dataTransfer.getData('audioSrc') || 'https://www.soundjay.com/button/beep-07.wav'
          },
          name: 'Audio',
          type: 'audio',
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
        return {
          id,
          content: {
            innerText: 'Link Element',
            href: 'https://example.com',
          },
          name: 'Link',
          type: 'link',
          styles: {
            ...defaultStyles,
            color: '#3b82f6',
            textDecoration: 'underline',
            padding: '8px 16px',
            display: 'inline-block'
          },
        };

      case 'container':
        return {
          id,
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

      case 'contactForm':
        return {
          id,
          content: {},
          name: 'Contact Form',
          type: 'contactForm',
          styles: {
            ...defaultStyles,
            padding: '24px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            minHeight: '300px'
          },
        };

      case 'ol':
        return {
          id,
          content: { items: ['Item 1', 'Item 2', 'Item 3'] },
          name: 'Ordered List',
          type: 'ol',
          styles: {
            ...defaultStyles,
            padding: '16px',
            paddingLeft: '32px',
          },
        };

      case 'ul':
        return {
          id,
          content: { items: ['Item 1', 'Item 2', 'Item 3'], bulletType: 'dot' },
          name: 'Unordered List',
          type: 'ul',
          styles: {
            ...defaultStyles,
            padding: '16px',
            paddingLeft: '32px',
          },
        };

      case 'TwoColcomponent':
        return {
          id,
          content: [
            {
              id: uuid(),
              content: [],
              name: 'Left Column',
              type: 'container',
              styles: {
                ...defaultStyles,
                minHeight: '200px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '2px dashed #cbd5e1'
              },
            },
            {
              id: uuid(),
              content: [],
              name: 'Right Column',
              type: 'container',
              styles: {
                ...defaultStyles,
                minHeight: '200px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '2px dashed #cbd5e1'
              },
            },
          ],
          name: '2 Columns',
          type: 'TwoColcomponent',
          styles: {
            ...defaultStyles,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            padding: '16px',
          },
        };

      case 'ThreeColComponent':
        return {
          id,
          content: [
            {
              id: uuid(),
              content: [],
              name: 'Column 1',
              type: 'container',
              styles: {
                ...defaultStyles,
                minHeight: '200px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '2px dashed #cbd5e1'
              },
            },
            {
              id: uuid(),
              content: [],
              name: 'Column 2',
              type: 'container',
              styles: {
                ...defaultStyles,
                minHeight: '200px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '2px dashed #cbd5e1'
              },
            },
            {
              id: uuid(),
              content: [],
              name: 'Column 3',
              type: 'container',
              styles: {
                ...defaultStyles,
                minHeight: '200px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '2px dashed #cbd5e1'
              },
            },
          ],
          name: '3 Columns',
          type: 'ThreeColComponent',
          styles: {
            ...defaultStyles,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
            padding: '16px',
          },
        };

      default:
        return {
          id,
          content: { innerText: 'Element' },
          name: 'Element',
          type: 'text',
          styles: defaultStyles,
        };
    }
  };

  const bodyElement = state.editor.elements.find(el => el.id === '__body');

  return (
    <div 
      className="flex-1 bg-muted overflow-auto"
      onClick={handleCanvasClick}
    >
      <div className="min-h-full p-8">
        <div
          className={`min-h-[calc(100vh-4rem)] bg-background rounded-lg shadow-sm border border-border transition-all ${
            state.editor.device === 'Desktop' ? 'w-full' :
            state.editor.device === 'Tablet' ? 'w-[768px] mx-auto' :
            'w-[375px] mx-auto'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          data-testid="editor-canvas"
        >
          {bodyElement && (
            <div style={bodyElement.styles} className="min-h-full">
              {Array.isArray(bodyElement.content) && bodyElement.content.length > 0 ? (
                bodyElement.content.map((element) => (
                  <Recursive key={element.id} element={element} />
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium mb-1">Drop elements here</p>
                    <p className="text-sm">Drag elements from the left sidebar to start building</p>
                  </div>
                </div>
              )}
            </div>
          ) }
        </div>
      </div>
    </div>
  );
}
