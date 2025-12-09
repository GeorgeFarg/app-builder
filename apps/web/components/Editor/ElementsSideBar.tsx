"use client";

import { defaultStyles } from "@/constants/editor";
import { EditorBtns } from "@/types/Editor";
import { 
  ImageIcon, 
  LinkIcon, 
  TextCursor, 
  VideoIcon, 
  Upload, 
  MousePointerClick,
  AudioLines,
  MessageSquare,
  ListOrdered,
  ListCollapse,
  Columns
} from "lucide-react";
import React, { useRef } from "react";

const ElementsSideBar = () => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData('componentType', type);
    
    switch (type) {
      case 'text':
        e.dataTransfer.setData('textContent', 'Text Element');
        break;
      case 'button':
        e.dataTransfer.setData('buttonText', 'Click Me');
        break;
        ///defualtimage
      case 'image':
        e.dataTransfer.setData('imageSrc', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop');
        e.dataTransfer.setData('imageAlt', 'Default Image');
        e.dataTransfer.setData('imageType', 'default');
        break;
      case 'video':
        e.dataTransfer.setData('videoSrc', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
        e.dataTransfer.setData('videoTitle', 'Default Video');
        e.dataTransfer.setData('videoType', 'default');
        break;
      case 'audio':
        e.dataTransfer.setData('audioSrc', 'https://www.soundjay.com/button/beep-07.wav');
        e.dataTransfer.setData('audioTitle', 'Default Audio');
        e.dataTransfer.setData('audioType', 'default');
        break;
        case 'contactForm':
            e.dataTransfer.setData('formType', 'contact');
            break;
        case 'paymentForm':
            e.dataTransfer.setData('formType', 'payment');
            break;
            case 'ul':
    e.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'ul',
        content: {
            items: ['Item 1', 'Item 2', 'Item 3']
        }
    }));
    break;
    case 'ol':
    e.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'ol',
        content: {
            items: ['Item 1', 'Item 2', 'Item 3'],
            listType: 'decimal' 
        }
    }));
    break;
    case 'TwoColcomponent':
    e.dataTransfer.setData('text/plain', JSON.stringify({
        type: '2col', 
        content: {
            left: ' left',
            right: ' right'
        }
    }));
    break;
     case 'ThreeColComponent':
    e.dataTransfer.setData('text/plain', JSON.stringify({
        type: '3col', 
        content: {
            column1: 'col1 ',
            column2: ' col2', 
            column3: ' col3'
        }
    }));
    break;
  }
  };
 

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        
        const customEvent = new CustomEvent('mediaUploaded', {
          detail: {
            type: 'image',
            url: imageUrl,
            fileName: file.name,
            fileType: file.type
          }
        });
        window.dispatchEvent(customEvent);
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const videoUrl = URL.createObjectURL(file);
      
      const customEvent = new CustomEvent('mediaUploaded', {
        detail: {
          type: 'video',
          url: videoUrl,
          fileName: file.name,
          fileType: file.type
        }
      });
      window.dispatchEvent(customEvent);
    }
    if (e.target) e.target.value = '';
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const audioUrl = URL.createObjectURL(file);
      
      const customEvent = new CustomEvent('mediaUploaded', {
        detail: {
          type: 'audio',
          url: audioUrl,
          fileName: file.name,
          fileType: file.type
        }
      });
      window.dispatchEvent(customEvent);
    }
    if (e.target) e.target.value = '';
  };

  const handleImageUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    imageInputRef.current?.click();
  };

  const handleVideoUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    videoInputRef.current?.click();
  };

  const handleAudioUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    audioInputRef.current?.click();
  };

  return (
    <div className="p-4 bg-slate-100 h-full">
      <h3 className="text-lg font-semibold mb-4">Elements</h3>
      
      <input type="file" ref={imageInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
      <input type="file" ref={videoInputRef} accept="video/*" onChange={handleVideoUpload} className="hidden" />
      <input type="file" ref={audioInputRef} accept="audio/*" onChange={handleAudioUpload} className="hidden" />
      
      <aside className='max-w-[150px] space-y-2'>
      {/* Text */}
      <div draggable className="p-3 rounded-lg cursor-grab text-center flex flex-col items-center justify-center hover:bg-white transition-colors border-2 border-dashed border-transparent hover:border-blue-400" onDragStart={e => handleDrag(e, 'text')}>
        <TextCursor size={20} className="mb-1" />
        <span className="text-xs">Text</span>
      </div>

  
  <div className="grid grid-cols-1 gap-2">
  <div 
    draggable
    onDragStart={(e) => handleDrag(e, 'image')} 
    onClick={handleImageUploadClick}
    className="p-3 rounded-lg cursor-grab text-center flex flex-col items-center justify-center hover:bg-white transition-colors border-2 border-dashed border-transparent hover:border-blue-400 relative group"
  >
    <ImageIcon size={20} className="mb-1" />
    <span className="text-xs">Image</span>
    <div className="absolute -top-1 -right-1 p-1 bg-green-500 text-white rounded-full">
      <Upload size={8} />
    </div>
    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center w-32">
      <div className="bg-black text-white text-xs rounded py-1 px-2 text-center">
        <div>Drag for default</div>
        <div>Click to upload</div>
      </div>
      <div className="w-3 h-3 bg-black rotate-45 transform -mt-2"></div>
    </div>
  </div>
          <div 
            draggable
            onDragStart={(e) => handleDrag(e, 'video')} 
            onClick={handleVideoUploadClick}
            className="p-3 rounded-lg cursor-grab text-center flex flex-col items-center justify-center hover:bg-white transition-colors border-2 border-dashed border-transparent hover:border-blue-400 relative group"
          >
            <VideoIcon size={20} className="mb-1" />
            <span className="text-xs">Video</span>

            
            <div className="absolute -top-1 -right-1 p-1 bg-green-500 text-white rounded-full">
              <Upload size={8} />
            </div>
            <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center w-32">
              <div className="bg-black text-white text-xs rounded py-1 px-2 text-center">
                <div>Drag for default</div>
                <div>Click to upload</div>
              </div>
              <div className="w-3 h-3 bg-black rotate-45 transform -mt-2"></div>
            </div>
          </div>


          <div 
            draggable
            onDragStart={(e) => handleDrag(e, 'audio')} 
            onClick={handleAudioUploadClick}
            className="p-3 rounded-lg cursor-grab text-center flex flex-col items-center justify-center hover:bg-white transition-colors border-2 border-dashed border-transparent hover:border-blue-400 relative group"
          >
            <AudioLines size={20} className="mb-1" />
            <span className="text-xs">Audio</span>
            <div className="absolute -top-1 -right-1 p-1 bg-green-500 text-white rounded-full">
              <Upload size={8} />
            </div>
            <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center w-32">
              <div className="bg-black text-white text-xs rounded py-1 px-2 text-center">
                <div>Drag for default</div>
                <div>Click to upload</div>
              </div>
              <div className="w-3 h-3 bg-black rotate-45 transform -mt-2"></div>
            </div>
          </div>

          {/* Link */}
          <div draggable className="p-3 rounded-lg cursor-grab text-center flex flex-col items-center justify-center hover:bg-white transition-colors border-2 border-dashed border-transparent hover:border-blue-400" onDragStart={e => handleDrag(e, 'link')}>
            <LinkIcon size={20} className="mb-1" />
            <span className="text-xs">Link</span>
          </div>
        </div>

     <div 
  draggable 
  className="p-3 rounded-lg cursor-grab text-center flex flex-col items-center justify-center hover:bg-white transition-colors border-2 border-dashed border-transparent hover:border-blue-400" 
  onDragStart={e => handleDrag(e, 'container')}
>
  <div className="w-4 h-4 border-2 border-gray-700 mb-1"></div>
  <span className="text-xs">Container</span>
</div>
<div 
  draggable 
  onDragStart={(e) => handleDrag(e, 'button')} 
  className="p-3 rounded-lg cursor-grab text-center flex flex-col items-center justify-center hover:bg-white transition-colors border-2 border-dashed border-transparent hover:border-blue-400"
>
    <MousePointerClick size={24} className="mb-1" />
    <span className="text-sm">Button</span>
</div>
        <div draggable onDragStart={(e) => handleDrag(e, 'contactForm')} className="p-3 rounded-lg cursor-grab text-center flex flex-col items-center justify-center hover:bg-white transition-colors border-2 border-dashed border-transparent hover:border-blue-400">
    <MessageSquare size={24} className="mb-1" />
    <span className="text-sm">Contact Form</span>
</div>
<div 
  draggable 
  onDragStart={(e) => handleDrag(e, 'ol')} 
  className="p-3 rounded-lg cursor-grab text-center flex flex-col items-center justify-center hover:bg-white transition-colors border-2 border-dashed border-transparent hover:border-blue-400"
>
    <ListOrdered size={24} className="mb-1" />
    <span className="text-sm">Ordered List</span>
</div>

<div 
  draggable 
  onDragStart={(e) => handleDrag(e, 'ul')} 
  className="p-3 rounded-lg cursor-grab text-center flex flex-col items-center justify-center hover:bg-white transition-colors border-2 border-dashed border-transparent hover:border-blue-400"
>
   <ListCollapse size={24} className="mb-1" />
    <span className="text-sm">Unordered List</span>
</div>
<div 
  draggable 
  onDragStart={(e) => handleDrag(e, 'TwoColcomponent')} 
  className="p-3 rounded-lg cursor-grab text-center flex flex-col items-center justify-center hover:bg-white transition-colors border-2 border-dashed border-transparent hover:border-blue-400"
>
  <Columns size={24} className="mb-1" />
  <span className="text-sm">2 Columns</span>
</div>
<div 
  draggable 
  onDragStart={(e) => handleDrag(e, 'ThreeColComponent')} 
  className="p-3 rounded-lg cursor-grab text-center flex flex-col items-center justify-center hover:bg-white transition-colors border-2 border-dashed border-transparent hover:border-blue-400"
>
  <div className="flex gap-0.5 mb-1">
    <div className="w-2 h-6 bg-blue-400 rounded"></div>
    <div className="w-2 h-6 bg-blue-400 rounded"></div>
    <div className="w-2 h-6 bg-blue-400 rounded"></div>
  </div>
  <span className="text-sm">3 Columns</span>
</div>
      </aside>
    </div>
  );
};

export default ElementsSideBar  

