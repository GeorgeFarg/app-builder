import EditorProvider from "@/providers/editor-provider";
import ElementsSidebar from '@/components/Editor/ElementsSideBar';
import EditorCanvas from '@/components/Editor/EditorCanvas';
import StyleSidebar from '@/components/Editor/StyleSidebar';
import EditorHeader from '@/components/Editor/EditorHeader';

export default function EditorPage() {
  return (
    <EditorProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <EditorHeader />
        <div className="flex-1 flex overflow-hidden">
          <ElementsSidebar />
          <EditorCanvas />
          <StyleSidebar />
        </div>
      </div>
    </EditorProvider>
  );
}
