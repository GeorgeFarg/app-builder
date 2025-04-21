import React from "react";

export type TagType = {
  id: string;
  tagName: string;
  props?: Record<string, any>;
  style?: React.CSSProperties;
  textContent?: string;
  children?: TagType[];
};

export type PageType = {
  tagName: "html";
  props: {
    lang: string;
  };
  style?: React.CSSProperties;
  children: [
    {
      tagName: "head";
      children: [
        {
          id: string;
          tagName: "title";
          children?: TagType[]; // could include nested tags like <meta> later
        }
      ];
    },
    {
      tagName: "body";
      children: TagType[];
    }
  ];
};

















// componentsLibrary.ts
export const DUMMY = [
    {
      type: 'Button',
      label: 'Button',
      defaultProps: {
        text: 'Click Me',
      },
    },
    {
      type: 'Input',
      label: 'Input',
      defaultProps: {
        placeholder: 'Enter text...',
      },
    },
    {
      type: 'Text',
      label: 'Text',
      defaultProps: {
        content: 'Hello World!',
      },
    },
  ];
  

