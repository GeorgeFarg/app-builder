import { PageType } from "@/types/page";
import { createStore } from "zustand/vanilla";

export type PageState = {
  page: PageType;
};

export type PageActions = {
  //  actions are to modify the page
  //  placeholder for now
  action: () => void;
};

export type PageStore = PageState & PageActions;

// required in every page
export const defaultInitState: () => PageState = () => ({
  page: {
    tagName: "html",
    props: {
      lang: "en",
    },
    children: [
      {
        tagName: "head",
        children: [
          {
            tagName: "title",
            id: "page title",
            text: "Here the title of the page",
          },
        ],
      },
      {
        tagName: "body",
        children: [
          {
            tagName: "button",
            id: "default-button",
            props: {
              text: "Click Me",
              textColor: "#FFFFFF",
              backgroundColor: "#007BFF",
            },
            children: [],
          },
          {
            tagName: "input",
            id: "default-input",
            props: {
              placeholder: "Enter text",
              textColor: "#000000",
              backgroundColor: "#FFFFFF",
            },
            children: [],
          },
          {
            tagName: "p",
            id: "default-text",
            props: {
              text: "Sample Text",
              textColor: "#000000",
            },
            children: [],
          },
        ],
      },
    ],
  },
});

export const createPageStore = (initState: PageState = defaultInitState()) => {
  return createStore<PageStore>()((set) => ({
    ...initState,
    action: () => {},
  }));
};
