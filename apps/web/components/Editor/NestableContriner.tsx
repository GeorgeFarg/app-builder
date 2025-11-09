'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { TreeNode } from '@/layouts/Editor'; 

type Props = {
  node: TreeNode;
};

export default function NestableContainer({ node }: Props) {
  const { setNodeRef: setDraggableRef, attributes, listeners, transform } = useDraggable({
    id: node.id,
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: node.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: 'transform 200ms ease',
  };

  return (
    <div
      ref={setDroppableRef}
      className={`p-4 border-2 rounded-md transition-colors ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}>
      <div
        ref={setDraggableRef}
        {...attributes}
        {...listeners}
        style={style}
        className='bg-white p-2 mb-2 rounded shadow cursor-grab'
      >
        Drag me — {node.id}
      </div>

      <div className='pl-4 space-y-2'>
        {node.children.map((child) => (
          <NestableContainer key={child.id} node={child} />
        ))}
      </div>
    </div>
  );
}
