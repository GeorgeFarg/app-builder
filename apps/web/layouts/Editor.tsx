"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import NestableContainer from "@/components/Editor/NestableContriner";

export type TreeNode = {
  id: string;
  children: TreeNode[];
};

const Editor = () => {
  const [tree, setTree] = useState<TreeNode[]>([
    { id: "1", children: [] },
    { id: "2", children: [
      {id: "69", children: []},
    ] },
    { id: "3", children: [] },
    { id: "4", children: [] },
    { id: "5", children: [] },
    { id: "6", children: [] },
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const findAndRemoveNode = (
    nodes: TreeNode[],
    id: string
  ): [TreeNode | undefined, TreeNode[]] => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (node && node.id === id) {
        const newNodes = [...nodes];
        const [removed] = newNodes.splice(i, 1);
        return [removed, newNodes];
      }

      const [removedChild, updatedChildren] = node
        ? findAndRemoveNode(node.children, id)
        : [undefined, []];
      if (removedChild) {
        const updatedNode: TreeNode | undefined = node
          ? {
              ...node,
              children: updatedChildren,
            }
          : undefined;

        const newNodes = [...nodes];
        if (updatedNode) newNodes[i] = updatedNode;

        return [removedChild, newNodes];
      }
    }

    return [undefined, nodes];
  };

  const insertNode = (
    nodes: TreeNode[],
    parentId: string,
    nodeToInsert: TreeNode
  ): TreeNode[] => {
    return nodes.map((node) => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, nodeToInsert],
        };
      }
      return {
        ...node,
        children: insertNode(node.children, parentId, nodeToInsert),
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const [draggedNode, withoutDragged] = findAndRemoveNode(
      [...tree],
      active.id.toString()
    );
    if (!draggedNode) return;

    const updated = insertNode(withoutDragged, over.id.toString(), draggedNode);
    setTree(updated);
    setActiveId(null);
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={({ active }) => setActiveId(active.id.toString())}>
      <div className='p-8 space-y-4'>
        {tree.map((node) => (
          <NestableContainer key={node.id} node={node} />
        ))}
      </div>
    </DndContext>
  );
};

export default Editor;
