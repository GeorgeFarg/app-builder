import { PageType } from '@/types/page'
import { createStore } from 'zustand/vanilla'

export type PageState = {
  page: PageType
}

export type PageActions = {
  //  actions are to modify the page
  //  placeholder for now 
  action: () => void
}

export type PageStore = PageState & PageActions

// required in every page
export const defaultInitState: () => PageState = () => ({
  page: {
    tagName: "html",
    props: {
      lang: "en"
    },
    children: [
      {
        tagName:"head",
        children: [
          {
            tagName: "title",
            id: "page title",
            children: []
          }
        ]
      },
      {
        tagName: 'body',
        children: []
      }
    ]
  } 
})

export const createPageStore = (
  initState: PageState = defaultInitState(),
) => {
  return createStore<PageStore>()((set) => ({
    ...initState,
   action: () => {},
  }))
}

