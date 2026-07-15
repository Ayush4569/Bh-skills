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
    <div className="w-full h-full border border-border/40 rounded-xl overflow-hidden bg-[#1e1e1e] dark:bg-[#1e1e1e] light:bg-[#ffff]">
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
          <div className="flex h-full items-center justify-center bg-card text-muted-foreground text-sm">
            Loading editor...
          </div>
        }
      />
    </div>
  );
}
