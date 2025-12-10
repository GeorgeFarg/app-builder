"use client";

import React from 'react'
import { useEditor } from '@/providers/editor-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { 
  Type, 
  Palette, 
  Box, 
  Square, 
  Circle,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  ArrowUpDown,
  Move,
  Layers
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function StyleSidebar() {
  const { state, dispatch } = useEditor();
  const selectedElement = state.editor.selectedElement;
  const {state: {editor}} = useEditor()
  const [styles, setStyles] = useState<React.CSSProperties>({});
  editor.selectedElement
  useEffect(() => {
    if (selectedElement?.id) {
      setStyles(selectedElement.styles || {});
    }
  }, [selectedElement]);

  const updateStyles = useCallback((newStyles: Partial<React.CSSProperties>) => {
    if (!selectedElement?.id) return;

    const updatedStyles = { ...styles, ...newStyles };
    setStyles(updatedStyles);

    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: {
        elementDetails: {
          ...selectedElement,
          styles: updatedStyles,
        },
      },
    });
  }, [selectedElement, dispatch]);

  const handleStyleChange = (property: keyof React.CSSProperties, value: string | number) => {
    updateStyles({ [property]: value });
  };

  const parseNumericValue = (value: string | number | undefined): number => {
    if (value === undefined) return 0;
    const num = typeof value === 'string' ? parseInt(value.replace(/[^0-9-]/g, '')) : value;
    return isNaN(num) ? 0 : num;
  };

  if (!selectedElement?.id) {
    return (
      <div className="w-80 bg-card border-l border-card-border flex flex-col h-full bg-gradient-to-b from-[#0A0229] via-[#3E1A6D] to-[#C95DB8]">
        <div className="p-4 border-b border-card-border bg-gradient-to-b from-[#0A0229] via-[#3E1A6D] to-[#C95DB8]">
          <h2 className="text-lg font-semibold text-foreground ">Element Styles</h2>
          <p className="text-sm text-muted-foreground mt-1">Customize your element</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Select an element to edit its styles</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-l border-card-border flex flex-col h-full bg-gradient-to-b from-[#0A0229] via-[#3E1A6D] to-[#C95DB8] ">
      <div className="p-4 border-b border-card-border">
        <h2 className="text-lg font-semibold text-foreground">Element Styles</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Editing: <span className="font-medium text-foreground">{selectedElement.name || selectedElement.type}</span>
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <Tabs defaultValue="style" className="w-full">
          <TabsList className="w-full grid grid-cols-3 m-2" style={{ width: 'calc(100% - 16px)' }}>
            <TabsTrigger value="style" data-testid="tab-style">Style</TabsTrigger>
            <TabsTrigger value="layout" data-testid="tab-layout">Layout</TabsTrigger>
            <TabsTrigger value="global" data-testid="tab-global">Global</TabsTrigger>
          </TabsList>
          
          <TabsContent value="style" className="mt-0">
            <Accordion type="multiple" defaultValue={['typography', 'background', 'border']} className="w-full">
              <AccordionItem value="typography" className="border-b border-card-border px-4">
                <AccordionTrigger className="py-3">
                  <div className="flex items-center gap-2">
                    <Type size={16} />
                    <span className="text-sm font-medium">Typography</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Font Size</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={parseNumericValue(styles.fontSize)}
                        onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                        className="flex-1"
                        data-testid="input-font-size"
                      />
                      <Select 
                        defaultValue="px"
                        onValueChange={(unit: any) => {
                          const size = parseNumericValue(styles.fontSize);
                          handleStyleChange('fontSize', `${size}${unit}`);
                        }}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="px">px</SelectItem>
                          <SelectItem value="rem">rem</SelectItem>
                          <SelectItem value="em">em</SelectItem>
                          <SelectItem value="%">%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Font Weight</Label>
                    <Select
                      value={String(styles.fontWeight || '400')}
                      onValueChange={(value: string | number) => handleStyleChange('fontWeight', value)}
                    >
                      <SelectTrigger data-testid="select-font-weight">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">Light (300)</SelectItem>
                        <SelectItem value="400">Regular (400)</SelectItem>
                        <SelectItem value="500">Medium (500)</SelectItem>
                        <SelectItem value="600">Semibold (600)</SelectItem>
                        <SelectItem value="700">Bold (700)</SelectItem>
                        <SelectItem value="800">Extra Bold (800)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Text Align</Label>
                    <div className="flex gap-1">
                      {[
                        { value: 'left', icon: AlignLeft },
                        { value: 'center', icon: AlignCenter },
                        { value: 'right', icon: AlignRight },
                        { value: 'justify', icon: AlignJustify },
                      ].map(({ value, icon: Icon }) => (
                        <Button
                          key={value}
                          size="icon"
                          variant={styles.textAlign === value ? 'default' : 'outline'}
                          onClick={() => handleStyleChange('textAlign', value as any)}
                          data-testid={`btn-align-${value}`}
                        >
                          <Icon size={16} />
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Text Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={styles.color?.toString() || '#000000'}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                        className="w-10 h-9 rounded-md border border-input cursor-pointer"
                        data-testid="input-text-color"
                      />
                      <Input
                        value={styles.color?.toString() || '#000000'}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                        className="flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Text Formatting</Label>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant={styles.fontWeight === '700' || styles.fontWeight === 'bold' ? 'default' : 'outline'}
                        onClick={() => handleStyleChange('fontWeight', styles.fontWeight === '700' || styles.fontWeight === 'bold' ? '400' : '700')}
                        data-testid="btn-bold"
                      >
                        <Bold size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant={styles.fontStyle === 'italic' ? 'default' : 'outline'}
                        onClick={() => handleStyleChange('fontStyle', styles.fontStyle === 'italic' ? 'normal' : 'italic')}
                        data-testid="btn-italic"
                      >
                        <Italic size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant={styles.textDecoration === 'underline' ? 'default' : 'outline'}
                        onClick={() => handleStyleChange('textDecoration', styles.textDecoration === 'underline' ? 'none' : 'underline')}
                        data-testid="btn-underline"
                      >
                        <Underline size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Line Height</Label>
                    <Slider
                      value={[parseFloat(String(styles.lineHeight || '1.5px'))]}
                      onValueChange={([value]) => handleStyleChange('lineHeight', `${value}px`)}
                      min={0.5}
                      max={3}
                      step={0.1}
                      data-testid="slider-line-height"
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {parseFloat(String(styles.lineHeight || 1.5)).toFixed(1)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Letter Spacing</Label>
                    <Slider
                      value={[parseNumericValue(styles.letterSpacing)]}
                      onValueChange={([value]) => handleStyleChange('letterSpacing', `${value}px`)}
                      min={-5}
                      max={20}
                      step={0.5}
                      data-testid="slider-letter-spacing"
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {parseNumericValue(styles.letterSpacing)}px
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="background" className="border-b border-card-border px-4">
                <AccordionTrigger className="py-3">
                  <div className="flex items-center gap-2">
                    <Palette size={16} />
                    <span className="text-sm font-medium">Background</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Background Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={styles.backgroundColor?.toString() || '#ffffff'}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        className="w-10 h-9 rounded-md border border-input cursor-pointer"
                        data-testid="input-bg-color"
                      />
                      <Input
                        value={styles.backgroundColor?.toString() || ''}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        className="flex-1"
                        placeholder="#ffffff or transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Opacity</Label>
                    <Slider
                      value={[Math.max(0, Math.min(100, parseFloat(String(styles.opacity || 1)) * 100 || 0))]}
                     onValueChange={([value = 0]) => handleStyleChange('opacity', value / 100)}
                      min={0}
                      max={100}
                      step={1}
                      data-testid="slider-opacity"
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {Math.round(Math.max(0, Math.min(100, parseFloat(String(styles.opacity || 1)) * 100 || 0)))}%
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="border" className="border-b border-card-border px-4">
                <AccordionTrigger className="py-3">
                  <div className="flex items-center gap-2">
                    <Square size={16} />
                    <span className="text-sm font-medium">Border</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Border Width</Label>
                    <Slider
                      value={[parseNumericValue(styles.borderWidth)]}
                      onValueChange={([value]) => handleStyleChange('borderWidth', `${value}px`)}
                      min={0}
                      max={20}
                      step={1}
                      data-testid="slider-border-width"
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {parseNumericValue(styles.borderWidth)}px
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Border Style</Label>
                    <Select
                      value={styles.borderStyle?.toString() || 'solid'}
                      onValueChange={(value: any) => handleStyleChange('borderStyle', value as any)}
                    >
                      <SelectTrigger data-testid="select-border-style">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="dashed">Dashed</SelectItem>
                        <SelectItem value="dotted">Dotted</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Border Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={styles.borderColor?.toString() || '#cccccc'}
                        onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                        className="w-10 h-9 rounded-md border border-input cursor-pointer"
                        data-testid="input-border-color"
                      />
                      <Input
                        value={styles.borderColor?.toString() || ''}
                        onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                        className="flex-1"
                        placeholder="#cccccc"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Border Radius</Label>
                    <Slider
                      value={[parseNumericValue(styles.borderRadius)]}
                      onValueChange={([value]) => handleStyleChange('borderRadius', `${value}px`)}
                      min={0}
                      max={100}
                      step={1}
                      data-testid="slider-border-radius"
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {parseNumericValue(styles.borderRadius)}px
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          
          <TabsContent value="layout" className="mt-0">
            <Accordion type="multiple" defaultValue={['dimensions', 'spacing']} className="w-full">
              <AccordionItem value="dimensions" className="border-b border-card-border px-4">
                <AccordionTrigger className="py-3">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown size={16} />
                    <span className="text-sm font-medium">Dimensions</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Width</Label>
                      <Input
                        value={styles.width?.toString() || ''}
                        onChange={(e) => handleStyleChange('width', e.target.value)}
                        placeholder="auto"
                        data-testid="input-width"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Height</Label>
                      <Input
                        value={styles.height?.toString() || ''}
                        onChange={(e) => handleStyleChange('height', e.target.value)}
                        placeholder="auto"
                        data-testid="input-height"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Min Width</Label>
                      <Input
                        value={styles.minWidth?.toString() || ''}
                        onChange={(e) => handleStyleChange('minWidth', e.target.value)}
                        placeholder="none"
                        data-testid="input-min-width"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Min Height</Label>
                      <Input
                        value={styles.minHeight?.toString() || ''}
                        onChange={(e) => handleStyleChange('minHeight', e.target.value)}
                        placeholder="none"
                        data-testid="input-min-height"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Max Width</Label>
                      <Input
                        value={styles.maxWidth?.toString() || ''}
                        onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
                        placeholder="none"
                        data-testid="input-max-width"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Max Height</Label>
                      <Input
                        value={styles.maxHeight?.toString() || ''}
                        onChange={(e) => handleStyleChange('maxHeight', e.target.value)}
                        placeholder="none"
                        data-testid="input-max-height"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="spacing" className="border-b border-card-border px-4">
                <AccordionTrigger className="py-3">
                  <div className="flex items-center gap-2">
                    <Move size={16} />
                    <span className="text-sm font-medium">Spacing</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground font-medium">Padding</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Top</Label>
                        <Input
                          type="number"
                          value={parseNumericValue(styles.paddingTop)}
                          onChange={(e) => handleStyleChange('paddingTop', `${e.target.value}px`)}
                          data-testid="input-padding-top"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Right</Label>
                        <Input
                          type="number"
                          value={parseNumericValue(styles.paddingRight)}
                          onChange={(e) => handleStyleChange('paddingRight', `${e.target.value}px`)}
                          data-testid="input-padding-right"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Bottom</Label>
                        <Input
                          type="number"
                          value={parseNumericValue(styles.paddingBottom)}
                          onChange={(e) => handleStyleChange('paddingBottom', `${e.target.value}px`)}
                          data-testid="input-padding-bottom"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Left</Label>
                        <Input
                          type="number"
                          value={parseNumericValue(styles.paddingLeft)}
                          onChange={(e) => handleStyleChange('paddingLeft', `${e.target.value}px`)}
                          data-testid="input-padding-left"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground font-medium">Margin</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Top</Label>
                        <Input
                          type="number"
                          value={parseNumericValue(styles.marginTop)}
                          onChange={(e) => handleStyleChange('marginTop', `${e.target.value}px`)}
                          data-testid="input-margin-top"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Right</Label>
                        <Input
                          type="number"
                          value={parseNumericValue(styles.marginRight)}
                          onChange={(e) => handleStyleChange('marginRight', `${e.target.value}px`)}
                          data-testid="input-margin-right"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Bottom</Label>
                        <Input
                          type="number"
                          value={parseNumericValue(styles.marginBottom)}
                          onChange={(e) => handleStyleChange('marginBottom', `${e.target.value}px`)}
                          data-testid="input-margin-bottom"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Left</Label>
                        <Input
                          type="number"
                          value={parseNumericValue(styles.marginLeft)}
                          onChange={(e) => handleStyleChange('marginLeft', `${e.target.value}px`)}
                          data-testid="input-margin-left"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="flexbox" className="border-b border-card-border px-4">
                <AccordionTrigger className="py-3">
                  <div className="flex items-center gap-2">
                    <Box size={16} />
                    <span className="text-sm font-medium">Flexbox</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Display</Label>
                    <Select
                      value={styles.display?.toString() || 'block'}
                      onValueChange={(value: any) => handleStyleChange('display', value as any)}
                    >
                      <SelectTrigger data-testid="select-display">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="block">Block</SelectItem>
                        <SelectItem value="flex">Flex</SelectItem>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="inline">Inline</SelectItem>
                        <SelectItem value="inline-block">Inline Block</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(styles.display === 'flex' || styles.display === 'inline-flex') && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Flex Direction</Label>
                        <Select
                          value={styles.flexDirection?.toString() || 'row'}
                          onValueChange={(value: any) => handleStyleChange('flexDirection', value as any)}
                        >
                          <SelectTrigger data-testid="select-flex-direction">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="row">Row</SelectItem>
                            <SelectItem value="row-reverse">Row Reverse</SelectItem>
                            <SelectItem value="column">Column</SelectItem>
                            <SelectItem value="column-reverse">Column Reverse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Justify Content</Label>
                        <Select
                          value={styles.justifyContent?.toString() || 'flex-start'}
                          onValueChange={(value: any) => handleStyleChange('justifyContent', value as any)}
                        >
                          <SelectTrigger data-testid="select-justify-content">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flex-start">Start</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="flex-end">End</SelectItem>
                            <SelectItem value="space-between">Space Between</SelectItem>
                            <SelectItem value="space-around">Space Around</SelectItem>
                            <SelectItem value="space-evenly">Space Evenly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Align Items</Label>
                        <Select
                          value={styles.alignItems?.toString() || 'stretch'}
                          onValueChange={(value: any) => handleStyleChange('alignItems', value as any)}
                        >
                          <SelectTrigger data-testid="select-align-items">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stretch">Stretch</SelectItem>
                            <SelectItem value="flex-start">Start</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="flex-end">End</SelectItem>
                            <SelectItem value="baseline">Baseline</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Gap</Label>
                        <Input
                          value={styles.gap?.toString() || ''}
                          onChange={(e) => handleStyleChange('gap', e.target.value)}
                          placeholder="10px"
                          data-testid="input-gap"
                        />
                      </div>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="global" className="mt-0">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Global CSS</Label>
                <textarea
                  value={state.editor.globalStyles}
                  onChange={(e) => dispatch({
                    type: 'UPDATE_GLOBAL_STYLES',
                    payload: { globalStyles: e.target.value }
                  })}
                  placeholder="Enter your global CSS here..."
                  className="w-full h-64 p-3 text-sm font-mono border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  data-testid="textarea-global-css"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                This CSS will be applied globally to the entire page.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}
