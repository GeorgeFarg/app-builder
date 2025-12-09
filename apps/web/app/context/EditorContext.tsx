import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

interface EditorContextType {
  elements: any[];
  setElements: Dispatch<SetStateAction<any[]>>;
  selectedElement: any | null;
  setSelectedElement: Dispatch<SetStateAction<any | null>>;
}

// نبدأ بقيمة null، و TypeScript يعرف أن السياق ممكن يكون null أول مرة
const EditorContext = createContext<EditorContextType | null>(null);

interface EditorContextProviderProps {
  children: React.ReactNode;
}

export const EditorContextProvider = ({ children }: EditorContextProviderProps) => {
  const [elements, setElements] = useState<any[]>([]);
  const [selectedElement, setSelectedElement] = useState<any | null>(null);

  return (
    <EditorContext.Provider value={{ elements, setElements, selectedElement, setSelectedElement }}>
      {children}
    </EditorContext.Provider>
  );
};

// Hook helper مع التأكد أن السياق موجود
export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorContextProvider");
  }
  return context;
}
