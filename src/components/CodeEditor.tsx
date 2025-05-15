import Editor from '@monaco-editor/react';
import type { EditorProps } from '../types';
import { Box } from '@mantine/core';

const languageMap = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  java: 'java',
  cpp: 'cpp',
  csharp: 'csharp',
  go: 'go',
  rust: 'rust',
} as const;

export function CodeEditor({ code, language, onChange, readOnly = false }: EditorProps) {
  return (
    <Box
      style={{
        height: '400px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <Editor
        height="100%"
        defaultLanguage={languageMap[language]}
        value={code}
        onChange={(value) => onChange?.(value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          readOnly,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
        }}
        theme="vs-dark"
      />
    </Box>
  );
} 