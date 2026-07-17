'use client';

import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from './theme-provider';

interface CodeEditorProps {
  challengeId: string;
  language: string;
  defaultValue: string;
  value: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({
  challengeId,
  language,
  defaultValue,
  value,
  onChange,
}: CodeEditorProps) {
  const { theme } = useTheme();
  const [editorLanguage, setEditorLanguage] = useState('html');

  useEffect(() => {
    // Map challenge language to Monaco editor language
    if (language === 'python') {
      setEditorLanguage('python');
    } else {
      setEditorLanguage('html');
    }
  }, [language]);

  const handleEditorChange = (val: string | undefined) => {
    const updatedCode = val || '';
    onChange(updatedCode);
    
    // Auto-save user code to localStorage
    localStorage.setItem(`challenge_code_${challengeId}`, updatedCode);
  };

  return (
    <div className={`w-full h-full border border-border/40 rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
      <Editor
        height="100%"
        language={editorLanguage}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        value={value}
        onChange={handleEditorChange}
        options={{
          fontSize: 14,
          fontFamily: "var(--font-geist-mono), Menlo, Monaco, 'Courier New', monospace",
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          roundedSelection: true,
          readOnly: false,
          cursorStyle: 'line',
          cursorBlinking: 'blink',
          tabSize: 2,
          padding: { top: 12, bottom: 12 },
        }}
        loading={
          <div className={`flex h-full flex-col items-center justify-center text-neutral-400 space-y-4 ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
            <div className="relative h-10 w-10">
              <div className={`absolute inset-0 rounded-full border-4 ${theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'}`} />
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-indigo-600 animate-spin" />
            </div>
            <span className={`text-xs font-semibold tracking-wider uppercase animate-pulse ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Initializing Editor...
            </span>
          </div>
        }
      />
    </div>
  );
}
