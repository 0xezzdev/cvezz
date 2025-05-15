import { useState } from 'react';
import { Textarea, Button, Stack } from '@mantine/core';
import type { CodeGeneratorFormProps, ProgrammingLanguage } from '../types';
import { LanguageSelector } from './LanguageSelector';

export function CodeGeneratorForm({ onSubmit, isLoading }: CodeGeneratorFormProps) {
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<ProgrammingLanguage>('python');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    onSubmit({
      description: description.trim(),
      language,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Textarea
          label="Algorithm Description"
          placeholder="Describe your algorithm or task in natural language..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          minRows={4}
          required
          styles={{
            input: {
              fontFamily: 'inherit',
            },
          }}
        />
        
        <LanguageSelector
          value={language}
          onChange={setLanguage}
        />

        <Button
          type="submit"
          loading={isLoading}
          disabled={!description.trim()}
          size="md"
          fullWidth
        >
          Generate Code
        </Button>
      </Stack>
    </form>
  );
} 