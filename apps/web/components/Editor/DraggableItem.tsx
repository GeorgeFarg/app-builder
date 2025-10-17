'use client'
import { useDraggable } from "@dnd-kit/core";

export const Draggable = () => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: "draggable",
    });
  
    const style = {
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      };

      
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className={`p-4 bg-blue-500 text-white rounded cursor-grab`}
      >
        Drag me
      </div>
    );
  };
  