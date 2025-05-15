import axios from 'axios';
import type { CodeGenerationRequest, CodeGenerationResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });

  failedQueue = [];
};

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If the error is not 401 or it's already a retry, reject immediately
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      try {
        const token = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Try to refresh the token
      const response = await api.post('/auth/refresh');
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      originalRequest.headers.Authorization = `Bearer ${token}`;
      
      processQueue(null, token);
      return api(originalRequest);
    } catch (refreshError: any) {
      processQueue(refreshError, null);
      
      // Only logout if refresh token is invalid or expired
      if (refreshError.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// Auth
export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  const { token } = response.data;
  localStorage.setItem('token', token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export type ProjectCategory = 
  | 'web' 
  | 'mobile'
  | 'desktop'
  | 'game'
  | 'ai'
  | 'backend'
  | 'frontend'
  | 'fullstack'
  | 'other';

export interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: ProjectCategory;
  githubLink?: string;
  liveLink?: string;
}

export interface ProjectInput {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: ProjectCategory;
  githubLink?: string;
  liveLink?: string;
}

// Projects
export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>('/projects');
  return response.data;
};

export const createProject = async (projectData: ProjectInput): Promise<Project> => {
  const response = await api.post<Project>('/projects', projectData);
  return response.data;
};

export const updateProject = async (id: string, projectData: Partial<ProjectInput>): Promise<Project> => {
  const response = await api.put<Project>(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

// Contact
export const submitContact = async (contactData: any) => {
  const response = await api.post('/contact', contactData);
  return response.data;
};

export const getContacts = async () => {
  const response = await api.get('/contact');
  return response.data;
};

export const deleteContact = async (id: string): Promise<void> => {
  await api.delete(`/contact/${id}`);
};

export const respondToContact = async (id: string, response: string) => {
  const res = await api.post(`/contact/${id}/respond`, { response });
  return res.data;
};

export const generateCode = async (request: CodeGenerationRequest): Promise<CodeGenerationResponse> => {
  try {
    const prompt = `Write a ${request.language} function based on the following task: ${request.description}\n\nProvide only the code without any explanation.`;
    
    const response = await api.post('/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a skilled programmer. Generate clean, well-documented code based on the given task description.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return {
      code: response.data.choices[0].message.content.trim(),
      language: request.language,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        code: '',
        language: request.language,
        error: error.response?.data?.error?.message || 'Failed to generate code',
      };
    }
    return {
      code: '',
      language: request.language,
      error: 'An unexpected error occurred',
    };
  }
};

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email: string;
  heroTitles: string[];
  heroSubtitles: string[];
}

// Personal Info
export const getPersonalInfo = async (): Promise<PersonalInfo> => {
  const response = await api.get<PersonalInfo>('/personal-info');
  return response.data;
};

export const updatePersonalInfo = async (data: Partial<PersonalInfo>): Promise<PersonalInfo> => {
  const response = await api.put<PersonalInfo>('/personal-info', data);
  return response.data;
};

export type SkillCategory = 
  | 'برمجة'
  | 'تصميم'
  | 'قواعد بيانات'
  | 'تطوير واجهات'
  | 'تطوير تطبيقات'
  | 'أخرى';

export interface Skill {
  _id: string;
  title: string;
  description: string;
  image: string;
  level: number;
  category: SkillCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillInput {
  title: string;
  description: string;
  image: string;
  level: number;
  category: SkillCategory;
}

// Skills
export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get<Skill[]>('/skills');
  return response.data;
};

export const createSkill = async (skillData: SkillInput): Promise<Skill> => {
  const response = await api.post<Skill>('/skills', skillData);
  return response.data;
};

export const updateSkill = async (id: string, skillData: Partial<SkillInput>): Promise<Skill> => {
  const response = await api.put<Skill>(`/skills/${id}`, skillData);
  return response.data;
};

export const deleteSkill = async (id: string): Promise<void> => {
  await api.delete(`/skills/${id}`);
};

export interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  image?: string;
  url?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CertificateInput {
  title: string;
  issuer: string;
  date: string;
  description?: string;
  image?: File | string | null;
  url?: string;
  order?: number;
}

// Certificates
export const getCertificates = async (): Promise<Certificate[]> => {
  const response = await api.get<Certificate[]>('/certificates');
  return response.data;
};

export const createCertificate = async (certificateData: FormData): Promise<Certificate> => {
  const response = await api.post<Certificate>('/certificates', certificateData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateCertificate = async (id: string, certificateData: FormData): Promise<Certificate> => {
  const response = await api.put<Certificate>(`/certificates/${id}`, certificateData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteCertificate = async (id: string): Promise<void> => {
  await api.delete(`/certificates/${id}`);
}; 