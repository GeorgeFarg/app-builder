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
  Columns,

} from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

const ElementsSideBar = () => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const checkScroll = () => {
    if (sidebarRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = sidebarRef.current;
      setShowScrollUp(scrollTop > 0);
      setShowScrollDown(scrollTop + clientHeight < scrollHeight - 10);
    }
  };

  const scrollUp = () => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollBy({ top: -100, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollBy({ top: 100, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkScroll();
    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('scroll', checkScroll);
      return () => sidebar.removeEventListener('scroll', checkScroll);
    }
  }, []);

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

  const allElements = [
    { type: 'text', label: 'Text', icon: <TextCursor size={20} /> },
    { type: 'button', label: 'Button', icon: <MousePointerClick size={20} /> },
    { type: 'link', label: 'Link', icon: <LinkIcon size={20} /> },
    { type: 'image', label: 'Image', icon: <ImageIcon size={20} />, uploadable: true },
    { type: 'video', label: 'Video', icon: <VideoIcon size={20} />, uploadable: true },
    { type: 'audio', label: 'Audio', icon: <AudioLines size={20} />, uploadable: true },
    { type: 'container', label: 'Container', icon: <div className="w-4 h-4 border-2 border-gray-700"></div> },
    { type: 'TwoColcomponent', label: '2 Columns', icon: <Columns size={20} /> },
    { type: 'ThreeColComponent', label: '3 Columns', icon: <div className="flex gap-0.5"><div className="w-2 h-4 bg-blue-400 rounded"></div><div className="w-2 h-4 bg-blue-400 rounded"></div><div className="w-2 h-4 bg-blue-400 rounded"></div></div> },
    { type: 'contactForm', label: 'Contact Form', icon: <MessageSquare size={20} /> },
    { type: 'ul', label: 'Unordered List', icon: <ListCollapse size={20} /> },
    { type: 'ol', label: 'Ordered List', icon: <ListOrdered size={20} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-100 border-l">

      <div className="p-4 border-b bg-white">
        <h3 className="text-lg font-semibold text-center">Elements</h3>
      </div>
      
      <input type="file" ref={imageInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
      <input type="file" ref={videoInputRef} accept="video/*" onChange={handleVideoUpload} className="hidden" />
      <input type="file" ref={audioInputRef} accept="audio/*" onChange={handleAudioUpload} className="hidden" />
      
           <div 
        ref={sidebarRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-slate-200 p-4"
        style={{ maxHeight: 'calc(100vh - 120px)' }}
      >
        <div className="grid grid-cols-1 gap-3">
          {allElements.map((element) => (
            <div 
              key={element.type}
              draggable
              onClick={element.uploadable ? 
                (element.type === 'image' ? handleImageUploadClick : 
                 element.type === 'video' ? handleVideoUploadClick : 
                 element.type === 'audio' ? handleAudioUploadClick : undefined) : undefined}
              onDragStart={e => handleDrag(e, element.type as EditorBtns)}
              className="p-4 rounded-lg cursor-grab text-center flex flex-col items-center justify-center hover:bg-white transition-colors border-2 border-dashed border-transparent hover:border-blue-400 bg-white shadow-sm relative group"
            >
              <div className="mb-2">{element.icon}</div>
              <span className="text-sm font-medium">{element.label}</span>
              
              {element.uploadable && (
                <>
                  <div className="absolute -top-1 -right-1 p-1 bg-green-500 text-white rounded-full">
                    <Upload size={8} />
                  </div>
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center w-32 z-30">
                    <div className="bg-black text-white text-xs rounded py-1 px-2 text-center">
                      <div>Drag for default</div>
                      <div>Click to upload</div>
                    </div>
                    <div className="w-3 h-3 bg-black rotate-45 transform -mt-2"></div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElementsSideBar;