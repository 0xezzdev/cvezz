export type ProgrammingLanguage = 
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'java'
  | 'cpp'
  | 'csharp'
  | 'go'
  | 'rust';

export interface CodeGenerationRequest {
  description: string;
  language: ProgrammingLanguage;
}

export interface CodeGenerationResponse {
  code: string;
  language: ProgrammingLanguage;
  error?: string;
}

export interface EditorProps {
  code: string;
  language: ProgrammingLanguage;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export interface LanguageSelectorProps {
  value: ProgrammingLanguage;
  onChange: (language: ProgrammingLanguage) => void;
}

export interface CodeGeneratorFormProps {
  onSubmit: (request: CodeGenerationRequest) => void;
  isLoading: boolean;
} 