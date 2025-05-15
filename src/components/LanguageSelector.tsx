import { Select } from '@mantine/core';
import type { ProgrammingLanguage, LanguageSelectorProps } from '../types';

const languages: { value: ProgrammingLanguage; label: string }[] = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <Select
      label="Programming Language"
      placeholder="Select a language"
      data={languages}
      value={value}
      onChange={(newValue) => onChange(newValue as ProgrammingLanguage)}
      styles={{
        input: {
          fontFamily: 'monospace',
        },
      }}
    />
  );
} 