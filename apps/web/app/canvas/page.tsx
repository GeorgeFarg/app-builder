"use client";
import dynamic from "next/dynamic";
import { useCounterStore } from "@/providers/createPageStore";
import { PageType } from "@/types/page";
import React from "react";

const UIBuilder = dynamic(() => import("@/layouts/Editor"), {
  ssr: false,
});

const CanvasPage = () => {
  const { page } = useCounterStore((state) => state);

  return (
    <UIBuilder/>
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
