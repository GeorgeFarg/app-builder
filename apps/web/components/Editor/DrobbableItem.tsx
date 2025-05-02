'use client';
import { useDroppable } from "@dnd-kit/core";
import React from "react";

type Props = {
  id: string;
  hasDropped: boolean;
  children?: React.ReactNode;
};

export const Droppable = ({ id, hasDropped, children }: Props) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`mt-4 h-40 w-full flex flex-col items-center justify-center border-2 rounded transition-colors duration-200 ${
        isOver ? "border-green-500 bg-green-100" : "border-gray-400"
      }`}
      style={{ minHeight: "150px" }}
    >
      <p className="mb-2 text-sm text-gray-700">Drop zone: {id}</p>
      {hasDropped ? children : <div className="text-gray-500">Drop here</div>}
    </div>
  );
};
