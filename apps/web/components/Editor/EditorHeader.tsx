"use client";

import { useEditor } from '@/providers/editor-provider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  EyeOff,
  Undo2,
  Redo2,
  Save
} from 'lucide-react';

export default function EditorHeader() {
  const { state, dispatch } = useEditor();

  const handleDeviceChange = (device: 'Desktop' | 'Tablet' | 'Mobile') => {
    dispatch({
      type: 'CHANGE_DEVICE',
      payload: { device },
    });
  };

  const handleToggleLiveMode = () => {
    dispatch({ type: 'TOGGLE_LIVE_MODE' });
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4">
      <div className="flex items-center gap-2">
        <div className="font-semibold text-foreground">Page Builder</div>
      </div>

      <div className="flex items-center gap-2">
        <Tabs 
          value={state.editor.device} 
          onValueChange={(value: string) => handleDeviceChange(value as 'Desktop' | 'Tablet' | 'Mobile')}
        >
          <TabsList>
            <TabsTrigger value="Desktop" data-testid="device-desktop">
              <Monitor size={16} />
            </TabsTrigger>
            <TabsTrigger value="Tablet" data-testid="device-tablet">
              <Tablet size={16} />
            </TabsTrigger>
            <TabsTrigger value="Mobile" data-testid="device-mobile">
              <Smartphone size={16} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={state.editor.liveMode ? 'default' : 'outline'}
          size="sm"
          onClick={handleToggleLiveMode}
          data-testid="toggle-preview"
        >
          {state.editor.liveMode ? (
            <>
              <EyeOff size={16} className="mr-2" />
              Exit Preview
            </>
          ) : (
            <>
              <Eye size={16} className="mr-2" />
              Preview
            </>
          )}
        </Button>
        
        <Button variant="outline" size="icon" data-testid="btn-undo">
          <Undo2 size={16} />
        </Button>
        
        <Button variant="outline" size="icon" data-testid="btn-redo">
          <Redo2 size={16} />
        </Button>
        
        <Button data-testid="btn-save">
          <Save size={16} className="mr-2" />
          Save
        </Button>
      </div>
    </header>
  );
}