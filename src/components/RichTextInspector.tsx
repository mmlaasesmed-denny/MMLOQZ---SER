import React, { useState } from 'react';
import { 
  Type, Palette, AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  List, ListOrdered, Sparkles, X, Check, Sliders, MoveVertical, MoveHorizontal
} from 'lucide-react';

interface RichTextInspectorProps {
  onClose: () => void;
  targetName?: string;
  onApplyStyles: (styles: {
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: string;
    listStyle?: 'disc' | 'decimal' | 'none';
    fontFamily?: string;
  }) => void;
}

const PRESET_COLORS = [
  '#0f172a', '#15803d', '#047857', '#0369a1', '#1d4ed8', 
  '#6d28d9', '#b91c1c', '#c2410c', '#334155', '#ffffff'
];

const FONT_FAMILIES = [
  { name: 'System Sans', value: 'system-ui, sans-serif' },
  { name: 'Inter / Modern', value: 'Inter, sans-serif' },
  { name: 'Playfair (Serif)', value: 'Playfair Display, Georgia, serif' },
  { name: 'JetBrains (Mono)', value: 'JetBrains Mono, monospace' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' }
];

export default function RichTextInspector({ onClose, targetName = 'Selected Text', onApplyStyles }: RichTextInspectorProps) {
  const [color, setColor] = useState('#0f172a');
  const [fontSize, setFontSize] = useState('18');
  const [fontWeight, setFontWeight] = useState('600');
  const [lineHeight, setLineHeight] = useState('1.5');
  const [letterSpacing, setLetterSpacing] = useState('0');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [listStyle, setListStyle] = useState<'none' | 'disc' | 'decimal'>('none');
  const [fontFamily, setFontFamily] = useState('system-ui, sans-serif');

  const update = (updated: Parameters<typeof onApplyStyles>[0]) => {
    onApplyStyles(updated);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-slate-700 w-84 sm:w-96 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
          <Type className="w-4 h-4" />
          <span>Text & Typography Inspector ({targetName})</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs">
        {/* 1. Color Picker */}
        <div>
          <label className="block font-semibold text-slate-300 mb-2">1. Text Color:</label>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  update({ color: c });
                }}
                className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                  color === c ? 'scale-110 border-emerald-400 ring-2 ring-emerald-500/50' : 'border-slate-700 hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                update({ color: e.target.value });
              }}
              className="w-7 h-7 rounded bg-transparent cursor-pointer border border-slate-700"
              title="Custom Color"
            />
          </div>
        </div>

        {/* 2. Font Family */}
        <div>
          <label className="block font-semibold text-slate-300 mb-1.5">2. Font Family:</label>
          <select
            value={fontFamily}
            onChange={(e) => {
              setFontFamily(e.target.value);
              update({ fontFamily: e.target.value });
            }}
            className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl p-2.5 outline-none focus:border-emerald-500"
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.value} value={f.value}>{f.name}</option>
            ))}
          </select>
        </div>

        {/* 3. Font Size & Weight */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-300">Font Size:</span>
              <span className="text-emerald-400 font-mono">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="72"
              value={fontSize}
              onChange={(e) => {
                setFontSize(e.target.value);
                update({ fontSize: `${e.target.value}px` });
              }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Font Weight:</label>
            <select
              value={fontWeight}
              onChange={(e) => {
                setFontWeight(e.target.value);
                update({ fontWeight: e.target.value });
              }}
              className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-1.5 outline-none focus:border-emerald-500"
            >
              <option value="300">Light (300)</option>
              <option value="400">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">SemiBold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">ExtraBold (800)</option>
            </select>
          </div>
        </div>

        {/* 4. Line Spacing (Line Height) */}
        <div>
          <div className="flex justify-between font-semibold mb-1">
            <span className="text-slate-300">Line Spacing (Line Height):</span>
            <span className="text-emerald-400 font-mono">{lineHeight}</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.5"
            step="0.1"
            value={lineHeight}
            onChange={(e) => {
              setLineHeight(e.target.value);
              update({ lineHeight: e.target.value });
            }}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* 5. Letter Spacing (Tracking) */}
        <div>
          <div className="flex justify-between font-semibold mb-1">
            <span className="text-slate-300">Letter Spacing (Tracking):</span>
            <span className="text-emerald-400 font-mono">{letterSpacing}px</span>
          </div>
          <input
            type="range"
            min="-2"
            max="12"
            value={letterSpacing}
            onChange={(e) => {
              setLetterSpacing(e.target.value);
              update({ letterSpacing: `${e.target.value}px` });
            }}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* 6. List Type Converter */}
        <div>
          <label className="block font-semibold text-slate-300 mb-1.5">Convert Text Style:</label>
          <div className="grid grid-cols-3 gap-1.5 bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => {
                setListStyle('none');
                update({ listStyle: 'none' });
              }}
              className={`py-1.5 text-[11px] font-bold rounded-lg cursor-pointer transition-colors ${
                listStyle === 'none' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Paragraph
            </button>
            <button
              onClick={() => {
                setListStyle('disc');
                update({ listStyle: 'disc' });
              }}
              className={`py-1.5 text-[11px] font-bold rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1 ${
                listStyle === 'disc' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3 h-3" />
              <span>Bullets</span>
            </button>
            <button
              onClick={() => {
                setListStyle('decimal');
                update({ listStyle: 'decimal' });
              }}
              className={`py-1.5 text-[11px] font-bold rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1 ${
                listStyle === 'decimal' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListOrdered className="w-3 h-3" />
              <span>Numbered</span>
            </button>
          </div>
        </div>

        {/* 7. Text Alignment */}
        <div>
          <label className="block font-semibold text-slate-300 mb-1.5">Text Alignment:</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setTextAlign('left'); update({ textAlign: 'left' }); }}
              className={`p-2 rounded-lg flex-1 flex justify-center cursor-pointer ${
                textAlign === 'left' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setTextAlign('center'); update({ textAlign: 'center' }); }}
              className={`p-2 rounded-lg flex-1 flex justify-center cursor-pointer ${
                textAlign === 'center' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setTextAlign('right'); update({ textAlign: 'right' }); }}
              className={`p-2 rounded-lg flex-1 flex justify-center cursor-pointer ${
                textAlign === 'right' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setTextAlign('justify'); update({ textAlign: 'justify' }); }}
              className={`p-2 rounded-lg flex-1 flex justify-center cursor-pointer ${
                textAlign === 'justify' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Done Button */}
      <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Done</span>
        </button>
      </div>
    </div>
  );
}
