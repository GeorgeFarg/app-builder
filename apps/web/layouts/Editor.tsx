"use client";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import { Draggable } from "@/components/Editor/DraggableItem";
import { Droppable } from "@/components/Editor/DrobbableItem";

const Editor = () => {
  const droppables = ['1', '2', '3', '4'];

  const [droppedZone, setDroppedZone] = useState<string | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    if (over && droppables.includes(over.id.toString())) {
      setDroppedZone(over.id.toString());
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className='p-8 max-w-md mx-auto space-y-4'>
      {!droppedZone && <Draggable/>}
        {droppables.map((id) => (
          <Droppable
            id={id}
            key={id}
            hasDropped={droppedZone === id}
          >
            {droppedZone === id && <Draggable />}
          </Droppable>
        ))}
      </div>
    </DndContext>
  );
};

export default Editor;
