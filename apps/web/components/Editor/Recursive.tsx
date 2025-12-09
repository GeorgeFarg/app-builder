"use client";
import React from "react";
import type { EditorElement } from "@/providers/editor-provider";
import { useEditor } from '@/providers/editor-provider';

import TextComponent from "./components/TextComponent";
import ImageComponent from "./components/ImageComponent";
import VideoComponent from "./components/VideoComponent";
import AudioComponent from "./components/AudioComponent";
import LinkComponent from "./components/LinkComponent";
import ButtonComponent from "./components/ButtonComponent";
import ContainerComponent from "./components/ContainerComponent";
import ContactFormComponent from "./components/ContactFormComponent";
import OLComponent from "./components/ol_listcomponent";
import ULComponent from "./components/ul_listcomponent";
import TwoColComponent from "./components/twoColcomponent";
import ThreeColComponent from "./components/ThreeColComponent";

interface RecursiveProps {
  element: EditorElement;
}

export default function Recursive({ element }: RecursiveProps) {
  const { dispatch } = useEditor();
const [showStyles, setShowStyles] = React.useState(false);

  const handleElementClick = (e: React.MouseEvent) => {
 e.stopPropagation();
  setShowStyles(!showStyles);
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const renderComponent = () => {
    switch (element.type) {
      case "text": return <TextComponent element={element} />;
      case "image": return <ImageComponent element={element} />;
      case "video": return <VideoComponent element={element} />;
      case "audio": return <AudioComponent element={element} />;
      case "link": return <LinkComponent element={element} />;
      case "button": return <ButtonComponent element={element} />;
      case "container":
      case "__body": return <ContainerComponent element={element} />;
      case "contactForm": return <ContactFormComponent element={element} />;
      case "ol": return <OLComponent element={element} />;
      case "ul": return <ULComponent element={element} />;
      case "TwoColcomponent": return <TwoColComponent element={element} />;
      case "ThreeColComponent": return <ThreeColComponent element={element} />;
      default: return <TextComponent element={element} />;
    }
  };

 return (
  <div onClick={handleElementClick} style={element.styles} className="relative">
  {renderComponent()}
  
  {showStyles && (
    <pre className="absolute top-0 left-full ml-2 p-2 bg-white border text-xs z-50">
      {JSON.stringify(element.styles, null, 2)}
    </pre>
  )}

  {Array.isArray(element.content) && element.content.map(child => (
    <Recursive key={child.id} element={child} />
  ))}
  </div>
);
}
