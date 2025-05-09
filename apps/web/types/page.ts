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
          text?: string;
        },
      ];
    },
    {
      tagName: "body";
      children: TagType[];
    },
  ];
};

type button = {
  type: "button";
  label: string;
  textColor: string;
  backgroundColor: string;
};

type input = {
  type: "input";
  label: string;
  placeholder: string;
  textColor: string;
  backgroundColor: string;
};

type text = {
  type: "text";
  content: string;
  textColor: string;
  backgroundColor: string;
};

export type ComponentType = {
  icon?: any;
  id: string;
  className?: string;
} & (button | input | text);
