"use client";
import dynamic from "next/dynamic";
import { usePageStore } from "@/providers/createPageStore";
import { PageType } from "@/types/page";
import React from "react";
import ElementsSideBar from "@/components/Editor/ElementsSideBar";

const UIBuilder = dynamic(() => import("@/layouts/Editor"), {
  ssr: false,
});

const CanvasPage = () => {
  const { page } = usePageStore((state) => state);

  return (
    <main className='flex min-h-screen min-w-full bg-gray-100'>
      <ElementsSideBar />
      <UIBuilder className='flex-auto' />
    </main>
    // <>
    //   <div
    //     id='editor'
    //     className='aspect-[16/9] w-full max-w-[1440px] bg-green-700 mx-auto'>
    //     {JSON.stringify(page)}
    //   </div>
    // </>
  );
};

export default CanvasPage;
