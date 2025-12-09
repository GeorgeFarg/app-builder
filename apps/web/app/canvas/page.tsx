"use client";
import dynamic from "next/dynamic";
import { usePageStore } from "@/providers/createPageStore";
import { PageType } from "@/types/page";
import React from "react";
import ElementsSideBar from "@/components/Editor/ElementsSideBar";
import EditorProvider from "@/providers/editor-provider";
import StyleSidebar from "@/components/Editor/StyleSidebar";

const Editor = dynamic(() => import("@/layouts/Editor-try"), {
  ssr: false,
});

const CanvasPage = () => {
  return (
<EditorProvider>
  <main className="flex w-full">
    {/* ===== Left Sidebar ===== */}
    <ElementsSideBar />

    {/* ===== Canvas Area ===== */}
    <div className="flex-1 [background-image:radial-gradient(#4e4e4e_2px,transparent_2px)] [background-size:28px_28px] h-[calc(100vh-50px)] flex items-center justify-center">
      <Editor />
    </div>

    {/* ===== Right Style Sidebar ===== */}
    <div className="w-72 h-[calc(100vh-50px)] border-l bg-white shadow-xl">
      <StyleSidebar />
    </div>
  </main>
</EditorProvider>

  );
};

export default CanvasPage;
