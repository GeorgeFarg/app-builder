"use client";
import dynamic from "next/dynamic";
import { usePageStore } from "@/providers/createPageStore";
import { PageType } from "@/types/page";
import React from "react";
import ElementsSideBar from "@/components/Editor/ElementsSideBar";

const UIBuilder = dynamic(() => import("@/layouts/Editor-try"), {
  ssr: false,
});




const CanvasPage = () => {
  const { page } = usePageStore((state) => state);

  return (
    <main className='flex'>
      <ElementsSideBar />
      <div className=" [background-image:radial-gradient(#4e4e4e_2px,transparent_2px)] [background-size:28px_28px] h-[calc(100vh-50px)] w-full flex items-center justify-center">
        <UIBuilder />

      </div>
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
