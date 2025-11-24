import { EditorBtns } from "@/types/Editor";
import { TextCursor } from "lucide-react";
import React from "react";


const ElementsSideBar = () => {

  const handleDrag = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return
    e.dataTransfer.setData('componentType', type)
  }

  return <aside className='max-w-[150px]'>
    <div
      draggable
      className="w-20 h-20 "
    >
      <TextCursor />
    </div>
  </aside>;
};

export default ElementsSideBar;
